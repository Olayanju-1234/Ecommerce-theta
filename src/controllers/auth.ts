import { errorResponse, successResponse } from '../utils';
import { body, query } from 'express-validator';
import {
  LocalSignUp,
  SignToken,
  LocalSignIn,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
} from '../services/Auth';
import { Enable2FA, Disable2FA, Verify2FA } from '../services/User';
import { Request, Response } from 'express';

export const validateRequests = (method: string) => {
  switch (method) {
    case 'signup': {
      return [
        body('email', 'Invalid email').isEmail(),
        body('password', 'Password must be at least 6 characters').isLength({
          min: 6,
        }),
        body('firstname', 'Firstname is required').exists(),
        body('lastname', 'Lastname is required').exists(),
        body('country', 'Country is required').exists(),
      ];
    }
    case 'login': {
      return [
        body('email', 'Invalid email').isEmail(),
        body('password', 'Password must be at least 6 characters').isLength({
          min: 6,
        }),
      ];
    }
    case 'verifyEmail': {
      return [query('token', 'Invalid token').isString()];
    }
    case 'forgotPassword': {
      return [body('email', 'Invalid email').isEmail()];
    }
    case 'resetPassword': {
      return [
        body('password', 'Password must be at least 6 characters').isLength({
          min: 6,
        }),
        body('token', 'Invalid token').isString(),
      ];
    }
    default:
      return [
        query('email', 'Invalid email').isEmail(),
        query('password', 'Password must be at least 6 characters').isLength({
          min: 6,
        }),
      ];
  }
};

export const localRegistration = async (req: Request, res: Response) => {
  try {
    const { email, password, firstname, lastname, country } = req.body;

    const response = await LocalSignUp({
      email,
      password,
      firstname,
      lastname,
      country,
    });

    const userToken = await SignToken({
      _id: response.user._id as any,
      access_level: response.user.access_level,
    });

    return successResponse(res, 201, { ...response, user: userToken });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const localLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userToken = await LocalSignIn(email, password);

    return successResponse(res, 200, userToken);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    const response = await VerifyEmail(token as string);

    return successResponse(res, 200, response);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const response = await ForgotPassword(email);

    return successResponse(res, 200, response);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, token } = req.body;

    const response = await ResetPassword(token, password);

    return successResponse(res, 200, response);
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const enable2FA = async (req: Request, res: Response) => {
  try {
    const { _id: userId } = req.user;
    const otpAuthUrl = await Enable2FA(userId);
    return successResponse(res, 200, {
      message: '2FA enabled successfully',
      otpAuthUrl,
    });
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const disable2FA = async (req: Request, res: Response) => {
  try {
    const { _id: userId } = req.user;
    const user = await Disable2FA(userId);
    return successResponse(res, 200, {
      message: '2FA disabled successfully',
      user,
    });
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const verify2FA = async (req: Request, res: Response) => {
  try {
    const { _id: userId } = req.user;
    const { token } = req.body;

    const isValid = await Verify2FA(userId, token);
    if (!isValid) throw new Error('Invalid 2FA token');

    return successResponse(res, 200, {
      message: '2FA token verified successfully',
    });
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};
