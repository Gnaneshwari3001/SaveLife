'use server';
/**
 * @fileOverview A flow for sending emails.
 *
 * - sendDonorConfirmationEmail - Sends a confirmation email to a new donor.
 * - EmailInput - The input type for the sendDonorConfirmationEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const EmailInputSchema = z.object({
  name: z.string().describe('The name of the donor.'),
  email: z.string().email().describe('The email address of the donor.'),
});
export type EmailInput = z.infer<typeof EmailInputSchema>;

const emailPrompt = ai.definePrompt({
  name: 'sendDonorConfirmationEmailPrompt',
  input: { schema: EmailInputSchema },
  prompt: `
    You are an email sending service.
    You are sending an email to a new blood donor.
    The user's name is {{name}}.
    The user's email is {{email}}.

    The email should have the following content:
    Subject: Thank you for registering as a blood donor!
    Body:
    Dear {{name}},

    Thank you for registering to become a blood donor with LifeStream Portal. You have successfully been added to our donor list.
    We will contact you shortly with more information about donation centers and upcoming blood drives.
    Your decision to donate can save lives, and we are grateful for your support.

    Sincerely,
    The LifeStream Portal Team

    Action: Send email to {{email}}
  `,
});

const sendDonorConfirmationEmailFlow = ai.defineFlow(
  {
    name: 'sendDonorConfirmationEmailFlow',
    inputSchema: EmailInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`Sending email to ${input.email}`);
    const { text } = await emailPrompt(input);

    // In a real application, you would integrate an email sending service here.
    // For now, we'll just log the action.
    console.log(`Email content for ${input.email}:`);
    console.log(text);
    return `Email sent to ${input.email}`;
  }
);

export async function sendDonorConfirmationEmail(input: EmailInput): Promise<string> {
  return await sendDonorConfirmationEmailFlow(input);
}
