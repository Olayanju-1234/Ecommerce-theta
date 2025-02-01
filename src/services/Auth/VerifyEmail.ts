import UserModel from '../../models/user.model';
import { SendEmailFromTemplate } from '../Email';

export const VerifyEmail = async (token: string) => {
  const user = await UserModel.findOne({ verification_token: token });

  console.log(token);
  console.log(user);

  if (!user) {
    throw new Error('Invalid verification token');
  }

  await UserModel.updateOne(
    { verification_token: token },
    { is_verified: true, verification_token: null },
  );

  await SendEmailFromTemplate({
    template: 'VerifyEmail',
    from: '[email protected]',
    to: user.email,
    data: {
      firstname: user.firstname,
      email: user.email,
    },
  });

  return true;
};
