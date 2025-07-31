'use server'

import nodemailer from 'nodemailer';
import 'dotenv/config';

export interface MailOptions {
  to: string;
  subject: string;
  body: string;
}

/**
 * Sends an email using Nodemailer.
 * @param mailOptions - The options for the email.
 * @returns A promise that resolves when the email is sent.
 */
export async function sendMail({ to, subject, body }: MailOptions) {
  const { 
    EMAIL_SERVER_HOST, 
    EMAIL_SERVER_PORT, 
    EMAIL_SERVER_USER, 
    EMAIL_SERVER_PASSWORD, 
    EMAIL_FROM 
  } = process.env;

  if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD || !EMAIL_FROM) {
    console.error("Email server environment variables are not configured. Skipping email sending.");
    throw new Error('Email service is not configured. Please check your environment variables.');
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port: parseInt(EMAIL_SERVER_PORT, 10),
    secure: parseInt(EMAIL_SERVER_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_SERVER_USER,
      pass: EMAIL_SERVER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `LifeStream Portal <${EMAIL_FROM}>`,
    to: to,
    subject: subject,
    html: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!', info);
    return info;
  } catch (error) {
    console.error('Error sending email via Nodemailer:', error);
    throw new Error('Failed to send email. Check server logs for details.');
  