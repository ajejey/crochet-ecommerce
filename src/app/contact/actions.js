'use server';

import { sendContactFormEmail } from '@/lib/email-auth';

export async function sendContactForm(formData) {
  return await sendContactFormEmail(formData);
}
