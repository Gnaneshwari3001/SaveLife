'use server'

export interface MailOptions {
  to: string;
  subject: string;
  body: string;
}

/**
 * Mocks sending an email by logging it to the console.
 * @param mailOptions - The options for the email.
 * @returns A promise that resolves when the email is "sent".
 */
export async function sendMail({ to, subject, body }: MailOptions) {
  console.log("--- Sending Mock Email ---");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("Body:");
  console.log(body);
  console.log("-------------------------");
  
  // In a real app, you would integrate with a real email service here.
  // For now, we just resolve the promise to simulate success.
  return Promise.resolve();
}
