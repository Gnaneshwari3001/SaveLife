'use server';
/**
 * @fileOverview A flow for sending admin notifications.
 *
 * - sendAdminNewDonorNotification - Sends an email to the admin when a new donor registers.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { AdminNotificationInputSchema, type AdminNotificationInput } from '@/ai/schemas/admin-notification-schema';
import { sendMail } from '@/services/email-service';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';

const adminEmailPrompt = ai.definePrompt({
  name: 'sendAdminNewDonorNotificationPrompt',
  input: { schema: AdminNotificationInputSchema },
  output: {
    schema: z.object({
      subject: z.string().describe('The subject of the email.'),
      body: z.string().describe('The HTML body of the email.'),
    }),
  },
  prompt: `
    You are an AI assistant for an email sending service for the LifeStream Portal.
    Generate an email to the site administrator to notify them of a new blood donor registration.

    The new donor's details are:
    Name: {{name}}
    Email: {{email}}
    Blood Group: {{bloodGroup}}

    The email should have the following content:
    Subject: New Donor Registration on LifeStream Portal

    Body:
    <p>Hello Admin,</p>

    <p>A new donor has registered on the LifeStream Portal. Please see their details below:</p>
    <ul>
      <li><strong>Name:</strong> {{name}}</li>
      <li><strong>Email:</strong> {{email}}</li>
      <li><strong>Blood Group:</strong> {{bloodGroup}}</li>
    </ul>
    <p>You can view all donor details in the admin dashboard.</p>

    <p>Thanks,</p>
    <p>The LifeStream Portal System</p>
  `,
});

const sendAdminNewDonorNotificationFlow = ai.defineFlow(
  {
    name: 'sendAdminNewDonorNotificationFlow',
    inputSchema: AdminNotificationInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`Generating admin notification for new donor: ${input.name}`);
    const { output } = await adminEmailPrompt(input);
    if (!output) {
      throw new Error('Failed to generate admin notification email content.');
    }

    const { subject, body } = output;

    console.log(`Sending admin notification to ${ADMIN_EMAIL}`);
    
    await sendMail({
      to: ADMIN_EMAIL,
      subject,
      body,
    });
    
    return `Admin notification successfully sent to ${ADMIN_EMAIL}`;
  }
);

export async function sendAdminNewDonorNotification(input: AdminNotificationInput): Promise<string> {
  return await sendAdminNewDonorNotificationFlow(input);
}
