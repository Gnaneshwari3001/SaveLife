/**
 * @fileOverview Schemas for admin notification AI flows.
 *
 * - AdminNotificationInputSchema - The Zod schema for the admin notification input.
 * - AdminNotificationInput - The TypeScript type for the admin notification input.
 */

import { z } from 'zod';

export const AdminNotificationInputSchema = z.object({
  name: z.string().describe("The name of the new donor."),
  email: z.string().email().describe("The email address of the new donor."),
  bloodGroup: z.string().describe("The blood group of the new donor."),
});
export type AdminNotificationInput = z.infer<typeof AdminNotificationInputSchema>;
