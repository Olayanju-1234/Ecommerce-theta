import * as mongoose from 'mongoose';
import { config } from './env';

const { MONGODB_URI } = config;

const log = (msg: string) => process.stdout.write(`[db] ${msg}\n`);

export const connectDB = async () => {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(MONGODB_URI)
    .then(() => log('connection established'))
    .catch((error) => {
      process.stderr.write(`[db] connection failed: ${error}\n`);
      process.exit(1);
    });
};
