import { Response } from 'express';

export const errorResponse = (
  res: Response,
  statusCode: number,
  error?: any,
) => {
  // Log internally but never expose raw error objects to clients
  if (error && statusCode >= 500) {
    process.stderr.write(`[error] ${statusCode}: ${JSON.stringify(error)}\n`);
  }
  const message =
    typeof error === 'string'
      ? error
      : error?.message ?? 'An unexpected error occurred';
  return res.status(statusCode).json({ error: true, message });
};

export const successResponse = (
  res: Response,
  statusCode: number,
  data: any,
) => {
  return res.status(statusCode).json(data);
};
