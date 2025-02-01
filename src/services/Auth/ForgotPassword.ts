import { nanoid } from 'nanoid';
import UserModel from '../../models/user.model';
import { SendEmailFromTemplate } from '../Email';

export const ForgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const reset_password_token = nanoid(6).toUpperCase();

  await UserModel.updateOne(
    { email },
    { reset_password_token, reset_password_expires: Date.now() + 3600000 },
  );

  await SendEmailFromTemplate({
    template: 'ForgotPassword',
    from: '[email protected]',
    to: email,
    data: {
      firstname: user.firstname,
      email: user.email,
      token: reset_password_token,
    },
  });

  return true;
};
