import { SignToken } from './SignToken';
import User from '../../models/user.model';
import { compare } from 'bcryptjs';

export const LocalSignIn = async (email: string, password: string) => {
  let user = await User.findOne({ email });

  if (!user) throw new Error('User not found');

  const isMatch = await compare(password, user.password);

  if (!isMatch) throw new Error('Invalid password');

  return SignToken({
    _id: user._id,
    access_level: user.access_level,
  });
};
