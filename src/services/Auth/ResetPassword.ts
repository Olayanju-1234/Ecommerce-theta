import UserModel from '../../models/user.model';
import { hash } from 'bcryptjs';
import { SendEmailFromTemplate } from '../Email';

export const ResetPassword = async (
  reset_password_token: string,
  password: string,
) => {
  const user = await UserModel.findOne({ reset_password_token });

  if (!user) {
    throw new Error('Invalid reset password token');
  }

  if (user.reset_password_expires && user.reset_password_expires < Date.now()) {
    throw new Error('Reset password token has expired');
  }

  const hashedPassword = await hash(password, 10);

  await UserModel.updateOne(
    { reset_password_token },
    {
      password: hashedPassword,
      reset_password_token: null,
      reset_password_expires: null,
    },
  );

  await SendEmailFromTemplate({
    template: 'ResetPassword',
    from: '[email protected]',
    to: user.email,
    data: {
      firstname: user.firstname,
      email: user.email,
    },
  });

  return true;
};
