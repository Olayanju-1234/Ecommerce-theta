import { ISignUpPayload, ISignUpResponse } from '../../interface';
import User from '../../models/user.model';
import { hash } from 'bcryptjs';

export const LocalSignUp = async (
  payload: ISignUpPayload,
): Promise<ISignUpResponse> => {
  const { email, password, firstname, lastname, country } = payload;

  const hashedPassword = await hash(password, 10);

  const user = await User.findOne({ email });

  if (user) {
    throw new Error('User already exists');
  }

  const newUser = new User({
    email,
    password: hashedPassword,
    firstname,
    lastname,
    country,
  });

  await newUser.save();

  return {
    status: 'successful',
    user: newUser,
  };
};
