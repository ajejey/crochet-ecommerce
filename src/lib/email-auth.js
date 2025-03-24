import nodemailer from 'nodemailer';
import { welcomeEmailTemplate } from './email-templates';
import { orderConfirmationTemplate } from './email-templates';

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
    from: `"Knotted with Love" <${process.env.GMAIL_USERNAME}>`,
    to: userEmail,
    subject: 'Welcome to Knitkart.in! 🧶',
    html: welcomeEmailTemplate({ userName }),
  });
}

// Send order confirmation email function
export async function sendOrderConfirmationEmail(orderData) {
  const { buyerEmail, buyerName, _id, items, totalAmount } = orderData;
  
  try {
    // Format items for email template
    const formattedItems = items.map(item => ({
      name: item.productId?.name || 'Product',
      quantity: item.quantity,
      price: item.price
    }));

    return await sendEmail({
      from: `"Knitkart.in Orders" <${process.env.GMAIL_USERNAME}>`,
      to: buyerEmail,
      subject: `Order Confirmation #${_id.toString().slice(-8)}`,
      html: orderConfirmationTemplate({ 
        userName: buyerName,
        orderNumber: _id.toString().slice(-8),
        items: formattedItems,
        total: totalAmount
      }),
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
}