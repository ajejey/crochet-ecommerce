import nodemailer from 'nodemailer';
import { welcomeEmailTemplate } from './email-templates';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Send email function
export async function sendEmail({ from, to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Send welcome email function
export async function sendWelcomeEmail(userEmail, userName) {
  return await sendEmail({
    from: process.env.GMAIL_USERNAME,
    to: userEmail,
    subject: 'Welcome to Knitkart.in! 🧶',
    html: welcomeEmailTemplate({ userName }),
  });
}