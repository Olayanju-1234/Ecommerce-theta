import { Router } from 'express';
import { auth, isSeller } from '../middlewares/auth';
import { rawBodyMiddleware } from '../middlewares/stripeWebhook';
import {
  onboardSeller,
  refreshOnboardingLink,
  getConnectStatus,
  createCheckoutSession,
  handleWebhook,
} from '../controllers/payment';

const router = Router();

// ─── Stripe Connect — Seller Onboarding ─────────────────────────────────────
// These routes require a seller-level account (access_level >= 2)

/** Create or retrieve a Stripe Connect account and return an onboarding URL */
router.post('/connect/onboard', auth, isSeller, onboardSeller);

/** Refresh a stale onboarding link (Stripe redirects here on expiry) */
router.get('/connect/refresh', auth, isSeller, refreshOnboardingLink);

/** Poll Stripe to check onboarding completion and charges/payouts enabled */
router.get('/connect/status', auth, isSeller, getConnectStatus);

// ─── Buyer Checkout ──────────────────────────────────────────────────────────

/** Create a Stripe Checkout Session for the authenticated buyer */
router.post('/checkout', auth, createCheckoutSession);

// ─── Stripe Webhooks ─────────────────────────────────────────────────────────
// NOTE: rawBodyMiddleware must run here — BEFORE the global express.json()
// parses the body. This is why the webhook route is registered in app.ts
// before express.json() is applied.

/** Stripe webhook receiver — signature-verified, raw body required */
router.post('/webhook', rawBodyMiddleware, handleWebhook);

export default router;
