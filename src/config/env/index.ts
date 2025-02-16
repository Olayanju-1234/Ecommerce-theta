import dotenv from 'dotenv';
import { schema } from './schema';
import { Validate } from './validators';
import { ConfigTypes } from '../types';
dotenv.config();

const envVarsSchema = Validate(schema);

const { error, value: envVariables } = envVarsSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);

export const config: ConfigTypes = {
  NODE_ENV: envVariables.NODE_ENV,
  PORT: envVariables.PORT,
  LOCAL_PORT: envVariables.LOCAL_PORT,
  MONGODB_URI: envVariables.MONGODB_URI,
  JWT_SECRET: envVariables.JWT_SECRET,
  REFRESH_TOKEN_SECRET: envVariables.REFRESH_TOKEN_SECRET,
  EMAIL: envVariables.EMAIL,
  EMAIL_PASSWORD: envVariables.EMAIL_PASSWORD,
  EMAIL_SERVICE: envVariables.EMAIL_SERVICE,
  EMAIL_PORT: envVariables.EMAIL_PORT,
  EMAIL_HOST: envVariables.EMAIL_HOST,
  EMAIL_SECURE: envVariables.EMAIL_SECURE,
  EMAIL_FROM: envVariables.EMAIL_FROM,
  CLOUDINARY_NAME: envVariables.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: envVariables.CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET: envVariables.CLOUDINARY_SECRET,
  BASE_URL: envVariables.BASE_URL,
  APP_URL: envVariables.APP_URL,
};
