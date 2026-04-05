import { SendEmail } from './SendEmail';
import { EmailPayload } from '../../interface';
import { renderTemplate } from './RenderTemplates';

/**
 * Sends an email after rendering a Pug template and subject.
 */
export const SendEmailFromTemplate = async (
  payload: EmailPayload,
): Promise<void> => {
  try {
    const { template, data = {} } = payload;

    // Generate subject + HTML from Pug template
    const { subject, html } = renderTemplate(template, data);

    // Send the email with the generated subject and HTML
    await SendEmail({ ...payload, subject }, html);
  } catch (error) {
    process.stderr.write(`[email] template send failed: ${error}\n`);
  }
};
