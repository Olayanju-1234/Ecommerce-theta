import { IOrderDocument } from '../interface';
import { model, Schema } from 'mongoose';

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price_at_purchase: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const shippingAddressSchema = new Schema(
  {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postal_code: { type: String, required: true },
  },
  { _id: false },
);

const orderSchemaFields = {
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: (v: any[]) => v.length > 0,
      message: 'Order must have at least one item',
    },
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  platform_fee: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending_payment',
  },
  payment_status: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded', 'partially_refunded'],
    default: 'unpaid',
  },
  stripe_session_id: {
    type: String,
    index: { sparse: true },
  },
  stripe_payment_intent_id: {
    type: String,
    index: { sparse: true },
  },
  stripe_transfer_id: {
    type: String,
  },
  shipping_address: {
    type: shippingAddressSchema,
  },
};

const orderSchema = new Schema(orderSchemaFields, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ payment_status: 1 });

const OrderModel = model<IOrderDocument>('order', orderSchema);
export default OrderModel;
