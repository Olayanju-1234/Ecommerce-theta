import { Request, Response, NextFunction } from 'express';

/**
 * Stripe requires the raw, unparsed request body to verify webhook signatures.
 * This middleware must be applied to the webhook route BEFORE express.json() runs.
 *
 * It collects the raw Buffer and attaches it to req.rawBody so the controller
 * can pass it to stripe.webhooks.constructEvent().
 */
export const rawBodyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let data = '';
  req.setEncoding('latin1');

  req.on('data', (chunk: string) => {
    data += chunk;
  });

  req.on('end', () => {
    (req as any).rawBody = Buffer.from(data, 'latin1');
    next();
  });

  req.on('error', (err) => {
    next(err);
  });
};
