import path from 'path';
import pug from 'pug';

/**
 * Renders an email template (subject + HTML).
 */
export const renderTemplate = (
  templateName: string,
  data: Record<string, any>,
): { subject: string; html: string } => {
  const baseDirectory = path.join(__dirname, '../../../emails', templateName);
  const assetsPath = path.join(__dirname, '../../../emails/assets'); // Shared assets folder

  // Pass assets path into Pug templates
  const templateData = { ...data, assetsPath };

  // Render Subject Pug
  const subjectPath = path.join(baseDirectory, 'subject.pug');
  const subject = pug.renderFile(subjectPath, templateData).trim(); // Remove whitespace

  // Render HTML Pug
  const htmlPath = path.join(baseDirectory, 'html.pug');
  const html = pug.renderFile(htmlPath, templateData);

  return { subject, html };
};
