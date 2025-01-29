import { IReview, IReviewDocument } from '../interface';
import { model, Schema } from 'mongoose';

const reviewSchemaFields: Record<keyof IReview, any> = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
};

const reviewSchema: Schema = new Schema(reviewSchemaFields, {
  timestamps: true,
});

const ReviewModel = model<IReviewDocument>('review', reviewSchema);

export default ReviewModel;
