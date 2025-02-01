import { createTransport } from 'nodemailer';
import { config } from '../../config/env';

const { EMAIL_PORT, EMAIL_HOST, EMAIL_SECURE, EMAIL, EMAIL_PASSWORD } = config;

console.log('EMAIL_PORT', EMAIL_PORT);
console.log('EMAIL_HOST', EMAIL_HOST);
console.log('EMAIL_SECURE', EMAIL_SECURE);
console.log('EMAIL', EMAIL);
console.log('EMAIL_PASSWORD', EMAIL_PASSWORD);

export default createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});
