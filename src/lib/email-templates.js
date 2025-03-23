// Email-safe styles that work across different email clients
const styles = {
  body: `
    margin: 0;
    padding: 0;
    background-color: #f8f8f8;
    font-family: Arial, sans-serif;
  `,
  container: `
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
  `,
  mainHeading: `
    font-family: serif;
    font-size: 32px;
    color: #111827;
    margin-bottom: 24px;
  `,
  subHeading: `
    font-size: 24px;
    font-weight: bold;
    color: #111827;
    margin-bottom: 16px;
  `,
  bodyText: `
    font-size: 16px;
    line-height: 1.6;
    color: #4B5563;
    margin-bottom: 16px;
  `,
  featureText: `
    font-size: 16px;
    line-height: 1.6;
    color: #374151;
    margin-bottom: 8px;
  `
};

// Base email template that uses table-based layout for better email client compatibility
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="${styles.body}">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" border="0" style="${styles.container}">
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Welcome email template
export const welcomeEmailTemplate = ({ userName }) => {
  const content = `
    <!-- Header -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center">
          <h1 style="${styles.mainHeading}">Welcome to Knitkart.in! 🧶</h1>
        </td>
      </tr>
    </table>

    <!-- Content -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td>
          <p style="${styles.bodyText}">Dear ${userName},</p>
          
          <p style="${styles.bodyText}">Welcome to Knitkart.in! We're thrilled to have you join our community of crochet enthusiasts.</p>
          
          <h2 style="${styles.subHeading}">At Knitkart.in, you'll find:</h2>
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td style="padding-left: 20px;">
                <p style="${styles.featureText}">• Handcrafted crochet products made with love</p>
                <p style="${styles.featureText}">• Unique designs and patterns</p>
                <p style="${styles.featureText}">• High-quality materials</p>
                <p style="${styles.featureText}">• Personalized customer service</p>
              </td>
            </tr>
          </table>
          
          <p style="${styles.bodyText}">Start exploring our collection and find something special that speaks to you.</p>
          
          <p style="${styles.bodyText}">Happy shopping!</p>
          
          <p style="${styles.bodyText}">Best regards,<br>The Knitkart.in Team</p>
        </td>
      </tr>
    </table>

    <!-- Footer -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 40px; border-top: 1px solid #E5E7EB;">
      <tr>
        <td align="center" style="padding-top: 20px;">
          <p style="font-size: 12px; color: #6B7280;">This email was sent to you because you signed up at Knitkart.in.</p>
        </td>
      </tr>
    </table>
  `;

  return baseTemplate(content);
};

// Order confirmation email template
export const orderConfirmationTemplate = ({ userName, orderNumber, items, total }) => {
  const content = `
    <!-- Header -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center">
          <h1 style="${styles.mainHeading}">Order Confirmation</h1>
        </td>
      </tr>
    </table>

    <!-- Content -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td>
          <p style="${styles.bodyText}">Dear ${userName},</p>
          
          <p style="${styles.bodyText}">Thank you for your order! We're excited to confirm that your order #${orderNumber} has been received.</p>
          
          <h2 style="${styles.subHeading}">Order Details:</h2>
          
          <!-- Order Items -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 20px 0;">
            ${items.map(item => `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
                  <p style="${styles.featureText}">${item.name}</p>
                  <p style="font-size: 14px; color: #6B7280; margin: 4px 0;">Quantity: ${item.quantity} × ₹${item.price}</p>
                </td>
              </tr>
            `).join('')}
            <tr>
              <td style="padding-top: 20px;">
                <p style="${styles.subHeading}">Total: ₹${total}</p>
              </td>
            </tr>
          </table>
          
          <p style="${styles.bodyText}">We'll notify you once your order ships.</p>
          
          <p style="${styles.bodyText}">Best regards,<br>The Knitkart.in Team</p>
        </td>
      </tr>
    </table>

    <!-- Footer -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 40px; border-top: 1px solid #E5E7EB;">
      <tr>
        <td align="center" style="padding-top: 20px;">
          <p style="font-size: 12px; color: #6B7280;">Thank you for shopping with Knitkart.in!</p>
        </td>
      </tr>
    </table>
  `;

  return baseTemplate(content);
};
