/**
 * @fileOverview Schemas for email-related AI flows.
 *
 * - EmailInputSchema - The Zod schema for the email input.
 * - EmailInput - The TypeScript type for the email input.
 */

import { z } from 'zod';

export const EmailInputSchema = z.object({
  name: z.string().describe('The name of the donor.'),
  email: z.string().email().describe('The email address of the donor.'),
});
export type EmailInput = z.infer<typeof EmailInputSchema>;
