'use server'

import sgMail from '@sendgrid/mail';
import 'dotenv/config';

export interface MailOptions {
  to: string;
  subject: string;
  body: string;
}

/**
 * Sends an email using the SendGrid API.
 * @param mailOptions - The options for the email.
 * @returns A promise that resolves when the email is sent.
 */
export async function sendMail({ to, subject, body }: MailOptions) {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    console.error("SendGrid API Key or From Email is not configured in .env file. Skipping email sending.");
    throw new Error('Email service is not configured. Please check your environment variables.');
  }

  // Set the API key right before sending the email.
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: to,
    from: process.env.EMAIL_FROM, // This must be a verified sender in your SendGrid account
    subject: subject,
    html: body,
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Email sent successfully! Status Code:', response[0].statusCode);
    return response;
  } catch (error) {
    console.error('Error sending email via SendGrid:');
    
    // Log more detailed error information from SendGrid if available
    if ((error as any).response) {
      console.error(JSON.stringify((error as any).response.body, null, 2));
    } else {
      console.error(error);
    }
    
    throw new Error('Failed to send email. Check server logs for details.');
  }
}
