'use server'

import nodemailer from 'nodemailer';
import 'dotenv/config';

export interface MailOptions {
  to: string;
  subject: string;
  body: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

/**
 * Sends an email using the configured Nodemailer transporter.
 * @param mailOptions - The options for the email.
 * @returns A promise that resolves when the email is sent.
 */
export async function sendMail({ to, subject, body }: MailOptions) {
  const mailOptions = {
    from: `"LifeStream Portal" <${process.env.EMAIL_FROM}>`,
    to: to,
    subject: subject,
    html: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email.');
  }
}
