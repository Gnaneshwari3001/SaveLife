'use server';
/**
 * @fileOverview A flow for sending emails.
 *
 * - sendDonorConfirmationEmail - Sends a confirmation email to a new donor.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { EmailInputSchema, type EmailInput } from '@/ai/schemas/email-schema';
import { sendMail } from '@/services/email-service';

const emailPrompt = ai.definePrompt({
  name: 'sendDonorConfirmationEmailPrompt',
  input: { schema: EmailInputSchema },
  output: {
    schema: z.object({
      subject: z.string().describe('The subject of the email.'),
      body: z.string().describe('The HTML body of the email.'),
    }),
  },
  prompt: `
    You are an AI assistant for an email sending service.
    Generate an email to a new blood donor.
    The user's name is {{name}}.
    The user's email is {{email}}.

    The email should have the following content:
    Subject: Thank you for registering as a blood donor!
    Body:
    <p>Dear {{name}},</p>

    <p>Thank you for registering to become a blood donor with <strong>LifeStream Portal</strong>. You have successfully been added to our donor list.</p>
    <p>We will contact you shortly with more information about donation centers and upcoming blood drives.</p>
    <p>Your decision to donate can save lives, and we are grateful for your support.</p>

    <p>Sincerely,</p>
    <p>The LifeStream Portal Team</p>
  `,
});

const sendDonorConfirmationEmailFlow = ai.defineFlow(
  {
    name: 'sendDonorConfirmationEmailFlow',
    inputSchema: EmailInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`Generating email content for ${input.email}`);
    const { output } = await emailPrompt(input);
    if (!output) {
      throw new Error('Failed to generate email content.');
    }

    const { subject, body } = output;

    console.log(`Sending email to ${input.email}`);
    
    await sendMail({
      to: input.email,
      subject,
      body,
    });
    
    return `Email successfully sent to ${input.email}`;
  }
);

export async function sendDonorConfirmationEmail(input: EmailInput): Promise<string> {
  return await sendDonorConfirmationEmailFlow(input);
}
