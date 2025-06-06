import nodemailer from 'nodemailer';
import { welcomeEmailTemplate } from './email-templates';
import { orderConfirmationTemplate, sellerOrderNotificationTemplate } from './email-templates';

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
    console.log('Attempting to send email to:', to);
    console.log('Email configuration:', {
      from,
      to,
      subject,
      transporterConfigured: !!process.env.GMAIL_USERNAME && !!process.env.GMAIL_PASSWORD
    });
    
    // Check if email configuration is available
    if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_PASSWORD) {
      console.error('Email configuration missing. Please set GMAIL_USERNAME and GMAIL_PASSWORD environment variables.');
      return { 
        success: false, 
        error: 'Email configuration missing', 
        configError: true 
      };
    }
    
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
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      stack: error.stack
    });
    return { 
      success: false, 
      error: error.message,
      errorCode: error.code,
      errorCommand: error.command,
      errorResponseCode: error.responseCode
    };
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
  console.log('Preparing order confirmation email for:', orderData._id);
  
  try {
    // Extract required data with fallbacks
    const buyerEmail = orderData.buyerEmail;
    const buyerName = orderData.buyerName || 'Customer';
    const orderId = orderData._id?.toString() || 'unknown';
    const items = Array.isArray(orderData.items) ? orderData.items : [];
    const totalAmount = orderData.totalAmount || 0;
    
    // Validate required data
    if (!buyerEmail) {
      console.error('Missing buyer email for order:', orderId);
      return { success: false, error: 'Missing buyer email', orderId };
    }
    
    if (items.length === 0) {
      console.warn('No items found for order:', orderId);
    }
    
    console.log('Order confirmation email data:', {
      orderId,
      buyerEmail,
      buyerName,
      itemCount: items.length,
      totalAmount
    });

    console.log("items[0]:", items[0]?.productId);
    
    // Format items for email template
    const formattedItems = items.map(item => ({
      name: item.productId?.name || 'Product',
      quantity: item.quantity || 1,
      price: item.price || 0,
      isMadeToOrder: item.isMadeToOrder || false,
      madeToOrderDays: item.madeToOrderDays || 7,
      imageUrl: item.productId?.images?.[0]?.url || null
    }));

    return await sendEmail({
      from: `"Knitkart.in Orders" <${process.env.GMAIL_USERNAME}>`,
      to: buyerEmail,
      subject: `Order Confirmation #${orderId.slice(-8)}`,
      html: orderConfirmationTemplate({ 
        userName: buyerName,
        orderNumber: orderId.slice(-8),
        items: formattedItems,
        total: totalAmount
      }),
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
}

// Send order notification email to seller
export async function sendSellerOrderNotificationEmail(orderData) {
  console.log('Preparing seller notification email for order:', orderData._id);
  
  try {
    // Extract required data with fallbacks
    const sellerEmail = orderData.sellerEmail;
    const sellerName = orderData.sellerName || 'Seller';
    const orderId = orderData._id?.toString() || 'unknown';
    const items = Array.isArray(orderData.items) ? orderData.items : [];
    const totalAmount = orderData.totalAmount || 0;
    const buyerName = orderData.buyerName || 'Customer';
    const sellerAmount = orderData.sellerAmount || totalAmount * 0.9; // Default to 90% if not specified
    const platformFee = orderData.platformFee || totalAmount * 0.1; // Default to 10% if not specified
    
    // Validate required data
    if (!sellerEmail) {
      console.error('Missing seller email for order:', orderId);
      return { success: false, error: 'Missing seller email', orderId };
    }
    
    if (items.length === 0) {
      console.warn('No items found for order:', orderId);
    }
    
    console.log('Seller notification email data:', {
      orderId,
      sellerEmail,
      sellerName,
      buyerName,
      itemCount: items.length,
      totalAmount,
      sellerAmount,
      platformFee
    });
    
    // Format items for email template
    const formattedItems = items.map(item => ({
      name: item.productId?.name || 'Product',
      quantity: item.quantity || 1,
      price: item.price || 0,
      isMadeToOrder: item.isMadeToOrder || false,
      madeToOrderDays: item.madeToOrderDays || 7,
      imageUrl: item.productId?.images?.[0]?.url || null
    }));

    // Format shipping address with fallbacks
    const shippingDetails = {
      address: orderData.shippingAddress || 'Not provided',
      city: orderData.shippingCity || 'Not provided',
      state: orderData.shippingState || 'Not provided',
      pincode: orderData.shippingPincode || 'Not provided'
    };

    return await sendEmail({
      from: `"Knitkart.in Seller Orders" <${process.env.GMAIL_USERNAME}>`,
      to: sellerEmail,
      subject: `New Order Received #${orderId.slice(-8)}`,
      html: sellerOrderNotificationTemplate({ 
        sellerName: sellerName,
        orderNumber: orderId.slice(-8),
        items: formattedItems,
        total: totalAmount,
        sellerAmount: sellerAmount,
        platformFee: platformFee,
        buyerName: buyerName,
        shippingDetails: shippingDetails
      }),
    });
  } catch (error) {
    console.error('Error sending seller order notification email:', error);
    return { success: false, error: error.message };
  }
}

// Send contact form email function
export async function sendContactFormEmail(formData) {
  console.log('Preparing contact form email with data:', formData);
  
  try {
    // Extract form data
    const { name, email, phone, subject, message } = formData;
    
    // Validate required data
    if (!name || !email || !subject || !message) {
      console.error('Missing required contact form fields');
      return { 
        success: false, 
        error: 'Missing required contact form fields' 
      };
    }
    
    // Create HTML content for the email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #E11D48; color: white; padding: 10px 20px; }
          .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; }
          .message { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span> ${name}
            </div>
            <div class="field">
              <span class="label">Email:</span> ${email}
            </div>
            <div class="field">
              <span class="label">Phone:</span> ${phone || 'Not provided'}
            </div>
            <div class="field">
              <span class="label">Subject:</span> ${subject}
            </div>
            <div class="field">
              <span class="label">Message:</span>
              <div class="message">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Send the email to the admin
    return await sendEmail({
      from: `"Knitkart.in Contact Form" <${process.env.GMAIL_USERNAME}>`,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USERNAME, // Send to admin email or fall back to the sender email
      subject: `New Contact Form: ${subject}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return { success: false, error: error.message };
  }
}