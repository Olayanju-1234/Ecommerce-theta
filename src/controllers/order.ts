import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils';
import OrderModel from '../models/order.model';

/**
 * GET /api/order/my-orders
 *
 * Returns the authenticated buyer's paginated order history.
 * Query params: page (default 1), limit (default 20), status (optional filter)
 */
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const buyerId = (req as any).user._id;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const status = req.query.status as string | undefined;

    const filter: Record<string, any> = { buyer: buyerId };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('seller', 'firstname lastname email')
        .populate('items.product', 'name images price brand')
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
 * GET /api/order/:id
 *
 * Returns a single order, accessible by the buyer or the seller on that order.
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { id } = req.params;

    const order = await OrderModel.findById(id)
      .populate('seller', 'firstname lastname email')
      .populate('buyer', 'firstname lastname email')
      .populate('items.product', 'name images price brand')
      .lean();

    if (!order) return errorResponse(res, 404, 'Order not found');

    if (
      String(order.buyer) !== String(userId) &&
      String(order.seller) !== String(userId)
    ) {
      return errorResponse(res, 403, 'Not authorised to view this order');
    }

    return successResponse(res, 200, order);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};
