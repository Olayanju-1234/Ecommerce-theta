import { Response } from 'express';

export const errorResponse = (
  res: Response,
  statusCode: number,
  error?: any,
) => {
  console.log(error);
  return res.status(statusCode).json(error);
};

export const successResponse = (
  res: Response,
  statusCode: number,
  data: any,
) => {
  return res.status(statusCode).json(data);
};
