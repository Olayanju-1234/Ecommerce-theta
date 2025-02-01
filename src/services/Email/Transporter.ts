import { createTransport } from 'nodemailer';
import { config } from '../../config/env';

const { EMAIL_PORT, EMAIL_HOST, EMAIL_SECURE, EMAIL, EMAIL_PASSWORD } = config;

export default createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});
