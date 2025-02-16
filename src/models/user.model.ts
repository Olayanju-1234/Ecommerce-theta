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
  is_verified: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  verification_token: {
    type: String,
  },
  twofa: {
    type: String,
  },
  reset_password_token: {
    type: String,
  },
  reset_password_expires: {
    type: Number,
  },
  profile_picture: {
    type: String,
    default: '',
  },
};

const userSchema: Schema = new Schema(userSchemaFields, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const UserModel = model<IUserDocument>('user', userSchema);
export default UserModel;
