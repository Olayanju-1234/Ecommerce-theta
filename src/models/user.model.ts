import { IUser, IUserDocument } from '../interface';
import { model, Schema } from 'mongoose';

const userSchemaFields: Record<keyof IUser, any> = {
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  access_level: {
    type: Number,
    required: true,
    default: 1,
  },
  country: {
    type: String,
    required: true,
  },
};

const userSchema = new Schema(userSchemaFields, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    },
  },
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    },
  },
});

const UserModel = model<IUserDocument>('User', userSchema);
export default UserModel;
