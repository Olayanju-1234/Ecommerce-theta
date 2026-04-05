import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { getMyOrders, getOrderById } from '../controllers/order';

const router = Router();

/** Get the authenticated buyer's order history (paginated) */
router.get('/my-orders', auth, getMyOrders);

/** Get a specific order by ID (buyer or seller of that order) */
router.get('/:id', auth, getOrderById);

export default router;
