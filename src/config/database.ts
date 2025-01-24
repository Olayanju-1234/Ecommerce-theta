import * as mongoose from 'mongoose';
import { config } from './env';

const { MONGODB_URI } = config;

export const connectDB = async () => {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('Database connection successful'))
    .catch((error) => {
      console.log('Error Connecting to Database' + error);
      process.exit();
    });
};
