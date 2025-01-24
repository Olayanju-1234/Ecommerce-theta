import { errorResponse } from './responseHandlers';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
const validateBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();
  const extractedErrors = [];
  errors.array().forEach((err: any) => {
    extractedErrors.push(`${err.param} invalid`);
  });
  const err = errors.array()[0];
  const errMessage = `${err.msg}`;

  return errorResponse(res, 400, errMessage);
};

export default validateBody;
