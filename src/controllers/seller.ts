import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { StripeService } from '../services/Stripe';
import { successResponse, errorResponse } from '../utils';
import UserModel from '../models/user.model';
import OrderModel from '../models/order.model';
import ProductModel from '../models/product.model';

/**
 * GET /api/seller/dashboard
 *
 * Returns aggregated stats for the authenticated seller:
 * total products, orders, revenue, pending payouts, and recent activity.
 */
export const getSellerDashboard = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user._id;
    // Aggregate pipelines don't auto-cast strings to ObjectId — must cast explicitly
    const sellerObjectId = new Types.ObjectId(sellerId);

    const [totalProducts, orderStats, recentOrders] = await Promise.all([
      ProductModel.countDocuments({ seller: sellerId }),

      OrderModel.aggregate([
        { $match: { seller: sellerObjectId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            revenue: { $sum: '$subtotal' },
          },
        },
      ]),

      OrderModel.find({ seller: sellerId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('buyer', 'firstname lastname email')
        .populate('items.product', 'name images price')
        .lean(),
    ]);

    const stats = {
      total_products: totalProducts,
      orders: {
        total: orderStats.reduce((acc: number, s: any) => acc + s.count, 0),
        by_status: Object.fromEntries(
          orderStats.map((s: any) => [s._id, s.count]),
        ),
      },
      revenue: {
        gross: orderStats.reduce((acc: number, s: any) => acc + s.revenue, 0),
        paid: orderStats
          .filter((s: any) => ['paid', 'processing', 'shipped', 'delivered'].includes(s._id))
          .reduce((acc: number, s: any) => acc + s.revenue, 0),
      },
      recent_orders: recentOrders,
    };

    return successResponse(res, 200, stats);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * GET /api/seller/orders
 *
 * Returns paginated orders for the seller, with optional status filter.
 *
 * Query params:
 *   page     (default: 1)
 *   limit    (default: 20)
 *   status   (optional: pending_payment|paid|processing|shipped|delivered|cancelled|refunded)
 */
export const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user._id;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const status = req.query.status as string | undefined;

    const filter: Record<string, any> = { seller: sellerId };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('buyer', 'firstname lastname email')
        .populate('items.product', 'name images price')
        .lean(),
      OrderModel.countDocuments(filter),
    ]);

    return successResponse(res, 200, {
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * GET /api/seller/payouts
 *
 * Returns payout history from Stripe for the seller's connected account,
 * along with their current available and pending balance.
 */
export const getSellerPayouts = async (req: Request, res: Response) => {
  try {
    const sellerId = (req as any).user._id;
    const user = await UserModel.findById(sellerId).lean();

    if (!user?.stripe_account_id) {
      return errorResponse(res, 400, 'Stripe account not connected. Complete onboarding first.');
    }

    if (!user.stripe_onboarding_complete) {
      return errorResponse(res, 422, 'Stripe onboarding is not yet complete.');
    }

    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);

    const [payouts, balance] = await Promise.all([
      StripeService.listPayouts(user.stripe_account_id, limit),
      StripeService.retrieveBalance(user.stripe_account_id),
    ]);

    return successResponse(res, 200, {
      balance: {
        available: balance.available.map((b) => ({
          amount: b.amount / 100,
          currency: b.currency,
        })),
        pending: balance.pending.map((b) => ({
          amount: b.amount / 100,
          currency: b.currency,
        })),
      },
      payouts: payouts.data.map((p) => ({
        id: p.id,
        amount: p.amount / 100,
        currency: p.currency,
        status: p.status,
        arrival_date: new Date(p.arrival_date * 1000).toISOString(),
        description: p.description,
        created: new Date(p.created * 1000).toISOString(),
      })),
      has_more: payouts.has_more,
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};
