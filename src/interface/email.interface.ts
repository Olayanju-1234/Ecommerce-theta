import Mail from 'nodemailer/lib/mailer';

export interface IEMailPayload {
  to?: string;
  from: string;
  subject?: string;
  html?: string;
  replyTo?: string;
}

export interface EmailPayload {
  template: string;
  to?: string | string[];
  sender_name?: string;
  locals?: object;
  attachments?: Mail.Attachment[];
  bcc?: string | string[];
  cc?: string | string[];
  replyTo?: string;
  from?: string;
  subject?: string;
  data?: Record<string, any>; // Fixed: Add data field to IEMailPayload
}
