import { IProduct, IProductDocument } from '../interface';
import { model, Schema } from 'mongoose';

const productSchemaFields: Record<keyof IProduct, any> = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount_percentage: {
    type: Number,
  },
  size: {
    type: String,
  },
  category: {
    type: String,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'tag',
    },
  ],
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'review',
    },
  ],
};

const productSchema: Schema = new Schema(productSchemaFields, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const ProductModel = model<IProductDocument>('product', productSchema);

export default ProductModel;
