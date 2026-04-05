import { Router } from 'express';
import { auth, isSeller } from '../middlewares/auth';
import {
  getSellerDashboard,
  getSellerOrders,
  getSellerPayouts,
} from '../controllers/seller';

const router = Router();

// All seller routes require authentication + seller access level

/** Aggregated stats: total products, orders by status, gross revenue */
router.get('/dashboard', auth, isSeller, getSellerDashboard);

/** Paginated order list for the seller (supports ?status= and ?page= filters) */
router.get('/orders', auth, isSeller, getSellerOrders);

/** Stripe payout history and current balance for the seller's connected account */
router.get('/payouts', auth, isSeller, getSellerPayouts);

export default router;
