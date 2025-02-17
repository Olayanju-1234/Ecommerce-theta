import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { errorResponse } from '../utils';
import { config } from '../config/env';
import { IUserAuthInfoRequest } from '../interface';

const { JWT_SECRET } = config;

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['x-access-token'] as string;

    if (!token) return errorResponse(res, 401, 'Request not authenticated');

    verify(token, JWT_SECRET as string, async (err: any, decoded: any) => {
      if (err) return errorResponse(res, 401, 'invalid token');

      decoded = decoded as IUserAuthInfoRequest;

      req.user = decoded;

      return next();
    });
  } catch (error) {
    return errorResponse(res, 500, error);
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  if (user.access_level < 2) return errorResponse(res, 401, 'Unauthorized');

  return next();
};

// export const isEmailVerified = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { user } = req;

//   if (!user.is_email_verified) {
//     return errorResponse(res, 401, "Email not verified");
//   }

//   return next();
// };
