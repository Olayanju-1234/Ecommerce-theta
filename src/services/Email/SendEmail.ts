import path from 'path';
import Transporter from './Transporter';
import { config } from '../../config/env';
import { EmailPayload } from '../../interface';

const { EMAIL } = config;

export const SendEmail = async (payload: EmailPayload, html: string) => {
  const { to, from, subject, replyTo, attachments } = payload;

  const assetsPath = path.join(__dirname, '../../../emails/assets'); // Shared assets folder

  await Transporter.sendMail({
    from: from || EMAIL,
    to,
    subject,
    html,
    replyTo,
    attachments: [
      ...(attachments || []),
      {
        filename: 'logo.png',
        path: path.join(assetsPath, 'logo.png'),
        cid: 'logo', // Embedded image in email
      },
      {
        filename: 'footer.png',
        path: path.join(assetsPath, 'footer.png'),
        cid: 'footer',
      },
    ],
  });
};
