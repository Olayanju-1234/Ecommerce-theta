import express, { NextFunction } from 'express';
import logger from 'morgan';
import { config } from './config/env';
import { Request, Response } from 'express';
import cors from 'cors';

// import routers
import authRouter from './routes/auth.routes';
// import config variables
const { NODE_ENV } = config;

const app = express();

let whitelist: string[] = ['http://localhost:3000', 'https://localhost:3000'];

const corsOptions = async (req: Request, callback: any) => {
  const requestedPath = req.path;

  const origin: any = req.get('origin');
  if (whitelist.indexOf(origin) !== -1 || !origin) {
    return callback(null, { origin: true });
  }

  if (requestedPath.startsWith('/public')) {
    // Allow CORS for the "/public" route
    return callback(null, { origin: true });
  }

  return callback('Not allowed by CORS', false);
};

app.use(cors(corsOptions));

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');

app.use(logger('dev'));

app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.json({ limit: '100mb' }));

// use routers
app.use('/auth', authRouter);

// handle 404 errors
app.use(function (_req: Request, res: Response) {
  res.status(404).json({
    error: true,
    message: 'Not Found',
  });
});

// handle celebrate validation errors
app.use(function onError(
  err: any,
  _req: Request,
  res: any,
  _next: NextFunction,
) {
  if (err.isJoi) {
    return res.status(400).json({
      error: true,
      message: err.details.map((error: any) => error.message).join(', '),
    });
  }
  _next(err);
});

app.use(function onError(
  err: any,
  _req: Request,
  res: any,
  _next: NextFunction,
) {
  res.statusCode = err === 'Not allowed by CORS' ? 403 : 500;
  res.end(`<h1>${err.toString()}</h1>`);
});

export default app;
