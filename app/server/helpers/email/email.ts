import * as brevo from '@getbrevo/brevo';
import { logger } from '../../utils/logger';
import { env } from '../../utils/env';
import { readTemplate } from './templates/templateLoader';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  template?: string;
  templateData?: Record<string, string | number>;
  from?: {
    email: string;
    name?: string;
  };
}

// Initialize Brevo API instance
const getApiInstance = (): brevo.TransactionalEmailsApi => {
  const apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, env.BREVO.API_KEY);
  return apiInstance;
};

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const { to, subject, html, template, templateData, from } = options;

    let emailHtml = html;

    // If template is provided, load and render it
    if (template) {
      emailHtml = await readTemplate(template, templateData || {});
    }

    if (!emailHtml) {
      throw new Error('Email content (html or template) is required');
    }

    const apiInstance = getApiInstance();
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = emailHtml;
    sendSmtpEmail.sender = from || {
      email: env.BREVO.FROM_EMAIL || 'noreply@example.com',
      name: env.BREVO.FROM_NAME || 'API',
    };

    // Handle single or multiple recipients
    if (Array.isArray(to)) {
      sendSmtpEmail.to = to.map((email) => ({ email }));
    } else {
      sendSmtpEmail.to = [{ email: to }];
    }

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    logger.info('Email sent successfully', {
      messageId: response.body?.messageId || 'unknown',
      to,
      subject,
    });
  } catch (error) {
    logger.error('Failed to send email', error, {
      to: options.to,
      subject: options.subject,
    });
    throw error;
  }
}
