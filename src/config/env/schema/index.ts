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
};
