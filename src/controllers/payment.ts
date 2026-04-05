import { Request, Response } from 'express';
import Stripe from 'stripe';
import { StripeService } from '../services/Stripe';
import { config } from '../config/env';
import { successResponse, errorResponse } from '../utils';
import UserModel from '../models/user.model';
import OrderModel from '../models/order.model';
import ProductModel from '../models/product.model';

const {
  BASE_URL,
  APP_URL,
  STRIPE_WEBHOOK_SECRET,
  STRIPE_PLATFORM_FEE_PERCENT,
} = config;

// ─── Seller Connect Onboarding ──────────────────────────────────────────────

/**
 * POST /api/payment/connect/onboard
 *
 * Creates a Stripe Express account for the authenticated seller (if they don't
 * have one yet) and returns a one-time onboarding URL.  The seller must visit
 * this URL to complete KYC before they can receive payouts.
 */
export const onboardSeller = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const user = await UserModel.findById(userId);

    if (!user) return errorResponse(res, 404, 'User not found');
    if (user.access_level < 2) {
      return errorResponse(res, 403, 'Only seller accounts can connect to Stripe');
    }

    // Create account only if they don't have one yet
    if (!user.stripe_account_id) {
      const account = await StripeService.createConnectAccount(
        user.email,
        user.country,
      );
      await UserModel.updateOne(
        { _id: userId },
        {
          stripe_account_id: account.id,
          stripe_account_status: 'pending',
          stripe_onboarding_complete: false,
        },
      );
      user.stripe_account_id = account.id;
    }

    const refreshUrl = `${BASE_URL}/api/payment/connect/refresh`;
    const returnUrl = `${APP_URL}/seller/onboarding-complete`;

    const accountLink = await StripeService.createAccountLink(
      user.stripe_account_id,
      refreshUrl,
      returnUrl,
    );

    return successResponse(res, 200, {
      onboarding_url: accountLink.url,
      expires_at: accountLink.expires_at,
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * GET /api/payment/connect/refresh
 *
 * Generates a fresh onboarding link when the previous one has expired.
 * Stripe redirects here when the seller's onboarding link is no longer valid.
 */
export const refreshOnboardingLink = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const user = await UserModel.findById(userId).lean();

    if (!user?.stripe_account_id) {
      return errorResponse(res, 400, 'No Stripe account found. Call /onboard first.');
    }

    const refreshUrl = `${BASE_URL}/api/payment/connect/refresh`;
    const returnUrl = `${APP_URL}/seller/onboarding-complete`;

    const accountLink = await StripeService.createAccountLink(
      user.stripe_account_id,
      refreshUrl,
      returnUrl,
    );

    return successResponse(res, 200, {
      onboarding_url: accountLink.url,
      expires_at: accountLink.expires_at,
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * GET /api/payment/connect/status
 *
 * Returns the seller's Stripe Connect account status and whether they have
 * completed onboarding (charges_enabled + payouts_enabled).
 */
export const getConnectStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const user = await UserModel.findById(userId).lean();

    if (!user?.stripe_account_id) {
      return successResponse(res, 200, {
        connected: false,
        onboarding_complete: false,
        stripe_account_id: null,
      });
    }

    const account = await StripeService.retrieveAccount(user.stripe_account_id);

    const onboardingComplete =
      account.charges_enabled && account.payouts_enabled;

    // Keep our DB in sync
    if (onboardingComplete && !user.stripe_onboarding_complete) {
      await UserModel.updateOne(
        { _id: userId },
        {
          stripe_account_status: 'active',
          stripe_onboarding_complete: true,
        },
      );
    }

    return successResponse(res, 200, {
      connected: true,
      onboarding_complete: onboardingComplete,
      stripe_account_id: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      requirements: account.requirements?.currently_due ?? [],
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

// ─── Buyer Checkout ──────────────────────────────────────────────────────────

/**
 * POST /api/payment/checkout
 *
 * Creates a Stripe Checkout Session for the buyer.  All items in the cart must
 * belong to the same seller (enforced here).  The platform fee is automatically
 * deducted before the remainder is transferred to the seller's Connect account.
 *
 * Body:
 *   items: Array<{ productId: string; quantity: number }>
 *   shippingAddress: { line1, city, state, country, postal_code }
 */
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const buyerId = (req as any).user._id;
    const buyer = await UserModel.findById(buyerId).lean();
    if (!buyer) return errorResponse(res, 404, 'User not found');

    const { items, shipping_address } = req.body as {
      items: Array<{ productId: string; quantity: number }>;
      shipping_address?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
      };
    };

    if (!items?.length) {
      return errorResponse(res, 400, 'Cart is empty');
    }

    // Fetch products in one query
    const productIds = items.map((i) => i.productId);
    const products = await ProductModel.find({ _id: { $in: productIds } })
      .populate('seller', 'stripe_account_id stripe_onboarding_complete')
      .lean();

    if (products.length !== items.length) {
      return errorResponse(res, 400, 'One or more products not found');
    }

    // Enforce single-seller cart
    const sellerIds = [...new Set(products.map((p) => String(p.seller)))];
    if (sellerIds.length > 1) {
      return errorResponse(
        res,
        400,
        'Checkout only supports items from a single seller per order. Please split your cart.',
      );
    }

    const seller = (products[0].seller as any);
    if (!seller?.stripe_account_id || !seller?.stripe_onboarding_complete) {
      return errorResponse(
        res,
        422,
        'Seller has not completed payment onboarding. Please try another seller.',
      );
    }

    // Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => {
        const product = products.find(
          (p) => String(p._id) === item.productId,
        )!;
        const discountFactor = 1 - (product.discount_percentage ?? 0) / 100;
        const unitAmountCents = Math.round(
          product.price * discountFactor * 100,
        );

        return {
          price_data: {
            currency: 'usd',
            unit_amount: unitAmountCents,
            product_data: {
              name: product.name,
              description: product.description?.slice(0, 500),
              images: product.images?.slice(0, 1),
            },
          },
          quantity: item.quantity,
        };
      });

    const metadata: Record<string, string> = {
      buyer_id: String(buyerId),
      seller_id: String(sellerIds[0]),
      items: JSON.stringify(
        items.map((i) => {
          const product = products.find((p) => String(p._id) === i.productId)!;
          const discountFactor = 1 - (product.discount_percentage ?? 0) / 100;
          return {
            productId: i.productId,
            quantity: i.quantity,
            price_at_purchase: product.price * discountFactor,
          };
        }),
      ),
      shipping_address: shipping_address ? JSON.stringify(shipping_address) : '',
    };

    const successUrl = `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${APP_URL}/checkout/cancel`;

    const session = await StripeService.createCheckoutSession(
      lineItems,
      seller.stripe_account_id,
      metadata,
      buyer.email,
      successUrl,
      cancelUrl,
      STRIPE_PLATFORM_FEE_PERCENT,
    );

    return successResponse(res, 201, {
      checkout_url: session.url,
      session_id: session.id,
      expires_at: session.expires_at,
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

// ─── Stripe Webhook Handler ───────────────────────────────────────────────────

/**
 * POST /api/payment/webhook
 *
 * Receives Stripe webhook events. The raw body is required for signature
 * verification (see rawBodyMiddleware). Processing is idempotent — the
 * session ID is stored on the order so duplicate deliveries are a no-op.
 */
export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  const rawBody = (req as any).rawBody as Buffer;

  if (!signature || !rawBody) {
    return res.status(400).json({ error: 'Missing stripe-signature header or body' });
  }

  let event: Stripe.Event;
  try {
    event = StripeService.constructWebhookEvent(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    // Invalid signature — reject immediately
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Clean up any pending order created for this session
        await OrderModel.deleteOne({
          stripe_session_id: session.id,
          status: 'pending_payment',
        });
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        await handleAccountUpdated(account);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await OrderModel.updateOne(
          { stripe_payment_intent_id: paymentIntent.id },
          { status: 'cancelled', payment_status: 'unpaid' },
        );
        break;
      }

      default:
        // Unhandled event types — acknowledge and ignore
        break;
    }

    // Always return 200 so Stripe stops retrying
    return res.status(200).json({ received: true });
  } catch (error: any) {
    // Return 500 so Stripe retries the event
    return res.status(500).json({ error: error.message });
  }
};

// ─── Internal Handlers ────────────────────────────────────────────────────────

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  // Idempotency: skip if we already processed this session
  const existing = await OrderModel.findOne({ stripe_session_id: session.id }).lean();
  if (existing) return;

  const {
    buyer_id,
    seller_id,
    items: itemsJson,
    shipping_address: shippingJson,
  } = session.metadata ?? {};

  if (!buyer_id || !seller_id || !itemsJson) return;

  const parsedItems = JSON.parse(itemsJson) as Array<{
    productId: string;
    quantity: number;
    price_at_purchase: number;
  }>;

  const subtotal = parsedItems.reduce(
    (acc, i) => acc + i.price_at_purchase * i.quantity,
    0,
  );
  const platformFee = subtotal * (STRIPE_PLATFORM_FEE_PERCENT / 100);
  const total = subtotal + 0; // shipping is free in this model

  await OrderModel.create({
    buyer: buyer_id,
    seller: seller_id,
    items: parsedItems.map((i) => ({
      product: i.productId,
      quantity: i.quantity,
      price_at_purchase: i.price_at_purchase,
    })),
    subtotal,
    platform_fee: platformFee,
    total,
    status: 'paid',
    payment_status: 'paid',
    stripe_session_id: session.id,
    stripe_payment_intent_id:
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id,
    shipping_address: shippingJson ? JSON.parse(shippingJson) : undefined,
  });
}

async function handleAccountUpdated(account: Stripe.Account): Promise<void> {
  const onboardingComplete =
    account.charges_enabled && account.payouts_enabled;

  await UserModel.updateOne(
    { stripe_account_id: account.id },
    {
      stripe_account_status: onboardingComplete
        ? 'active'
        : account.requirements?.disabled_reason
          ? 'restricted'
          : 'pending',
      stripe_onboarding_complete: onboardingComplete,
    },
  );
}
