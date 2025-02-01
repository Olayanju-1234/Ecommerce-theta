import { ISignUpPayload, ISignUpResponse } from '../../interface';
import User from '../../models/user.model';
import { hash } from 'bcryptjs';
import { SendEmailFromTemplate } from '../Email';
import { config } from '../../config/env';
import { nanoid } from 'nanoid';

const { EMAIL } = config;

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

  // generate a verification token
  const verifcation_token = nanoid(6).toUpperCase();
  newUser.verifcation_token = verifcation_token;

  await SendEmailFromTemplate({
    template: 'WelcomeEmail',
    from: EMAIL,
    to: email,
    data: {
      firstname,
      email,
      token: verifcation_token,
    },
  });

  await newUser.save();

  return {
    status: 'successful',
    user: newUser,
  };
};
