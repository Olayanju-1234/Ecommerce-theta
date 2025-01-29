import { ITag, ITagDocument } from '../interface';
import { model, Schema } from 'mongoose';

const tagSchemaFields: Record<keyof ITag, any> = {
  name: {
    type: String,
    required: true,
    trim: true,
  },
};

const tagSchema: Schema = new Schema(tagSchemaFields, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const TagModel = model<ITagDocument>('tag', tagSchema);
export default TagModel;
