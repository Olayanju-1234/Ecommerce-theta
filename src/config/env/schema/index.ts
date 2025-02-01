import { Joi } from 'celebrate';

export const schema = {
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging', 'local')
    .default('development'),
  PORT: Joi.number().default(5000),
  LOCAL_PORT: Joi.number().default(3003),
  MONGODB_URI: Joi.string()
    .description('Production Database host name')
    .required(),
  JWT_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  EMAIL: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_PORT: Joi.number().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_SECURE: Joi.boolean().required(),
  EMAIL_FROM: Joi.string().required(),
};
