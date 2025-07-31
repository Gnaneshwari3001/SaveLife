'use server'

import sgMail from '@sendgrid/mail';
import 'dotenv/config';

export interface MailOptions {
  to: string;
  subject: string;
  body: string;
}

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("SENDGRID_API_KEY not found in environment variables. Email sending will be disabled.");
}

/**
 * Sends an email using the SendGrid API.
 * @param mailOptions - The options for the email.
 * @returns A promise that resolves when the email is sent.
 */
export async function sendMail({ to, subject, body }: MailOptions) {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    console.error("SendGrid API Key or From Email is not configured. Skipping email sending.");
    // We'll throw an error to make it clear in the flow that sending failed.
    throw new Error('Email service is not configured.');
  }

  const msg = {
    to: to,
    from: process.env.EMAIL_FROM, // This must be a verified sender in your SendGrid account
    subject: subject,
    html: body,
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Email sent successfully!', response[0].statusCode);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);

    if ((error as any).response) {
      console.error((error as any).response.body)
    }
    
    throw new Error('Failed to send email via SendGrid.');
  }
}