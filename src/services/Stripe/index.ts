import Stripe from 'stripe';
import { config } from '../../config/env';

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

export const StripeService = {
  /**
   * Create a Stripe Express Connect account for a seller.
   * Express accounts give sellers the fastest onboarding and Stripe-hosted dashboard.
   */
  async createConnectAccount(
    email: string,
    country: string,
  ): Promise<Stripe.Account> {
    return stripe.accounts.create({
      type: 'express',
      email,
      country: country.toUpperCase().slice(0, 2),
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      settings: {
        payouts: {
          schedule: {
            interval: 'weekly',
            weekly_anchor: 'monday',
          },
        },
      },
    });
  },

  /**
   * Generate an onboarding link for the seller to complete KYC on Stripe's hosted UI.
   */
  async createAccountLink(
    accountId: string,
    refreshUrl: string,
    returnUrl: string,
  ): Promise<Stripe.AccountLink> {
    return stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });
  },

  /**
   * Retrieve a Connect account to check onboarding status.
   */
  async retrieveAccount(accountId: string): Promise<Stripe.Account> {
    return stripe.accounts.retrieve(accountId);
  },

  /**
   * Create a Stripe Checkout Session for a buyer purchasing from a seller.
   *
   * Uses destination charges: the charge is created on the platform, Stripe
   * then transfers `transfer_data.amount` to the connected account automatically.
   * The platform keeps `application_fee_amount` as its cut.
   *
   * @param lineItems - Products being purchased
   * @param sellerStripeAccountId - Seller's Stripe Connect account ID
   * @param metadata - Order metadata stored on the session for webhook processing
   * @param customerEmail - Buyer's email for receipt
   * @param successUrl - Redirect URL on successful payment
   * @param cancelUrl - Redirect URL when buyer cancels
   * @param platformFeePercent - Platform fee percentage (e.g. 10 for 10%)
   */
  async createCheckoutSession(
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    sellerStripeAccountId: string,
    metadata: Record<string, string>,
    customerEmail: string,
    successUrl: string,
    cancelUrl: string,
    platformFeePercent: number,
  ): Promise<Stripe.Checkout.Session> {
    // Calculate subtotal in cents to derive the application fee
    const subtotalCents = lineItems.reduce((acc, item) => {
      const unitAmount = (item.price_data as any)?.unit_amount ?? 0;
      const qty = item.quantity ?? 1;
      return acc + unitAmount * qty;
    }, 0);

    const applicationFeeCents = Math.round(
      subtotalCents * (platformFeePercent / 100),
    );

    return stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: lineItems,
      metadata,
      payment_intent_data: {
        application_fee_amount: applicationFeeCents,
        transfer_data: {
          destination: sellerStripeAccountId,
        },
        metadata,
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'GB', 'NG', 'GH', 'KE', 'ZA', 'CA', 'AU'],
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30-minute expiry
    });
  },

  /**
   * Construct and verify a Stripe webhook event using the raw request body.
   * This MUST receive the raw body — not the JSON-parsed body — for the
   * HMAC-SHA256 signature to validate correctly.
   */
  constructWebhookEvent(
    rawBody: Buffer,
    signature: string,
    webhookSecret: string,
  ): Stripe.Event {
    return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  },

  /**
   * List payouts for a connected seller account.
   */
  async listPayouts(
    accountId: string,
    limit = 20,
  ): Promise<Stripe.ApiList<Stripe.Payout>> {
    return stripe.payouts.list({ limit }, { stripeAccount: accountId });
  },

  /**
   * Retrieve the balance for a connected seller account.
   */
  async retrieveBalance(accountId: string): Promise<Stripe.Balance> {
    return stripe.balance.retrieve({ stripeAccount: accountId });
  },
};
