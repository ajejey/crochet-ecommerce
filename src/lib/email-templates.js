// Email-safe styles that work across different email clients
export const styles = {
  body: `
    margin: 0;
    padding: 0;
    background-color: #FDF2F8;
    font-family: Arial, sans-serif;
  `,
  container: `
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  `,
  header: `
    background-color: #E11D48;
    padding: 20px;
    text-align: center;
  `,
  headerText: `
    font-family: serif;
    font-size: 28px;
    color: #ffffff;
    margin: 0;
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
  sectionHeading: `
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
    border-bottom: 2px solid #FDE8EF;
    padding-bottom: 8px;
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
  `,
  highlightText: `
    color: #E11D48;
    font-weight: 600;
  `,
  orderNumber: `
    display: inline-block;
    background-color: #FDF2F8;
    color: #E11D48;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 4px;
    margin: 0 4px;
  `,
  itemCard: `
    background-color: #FFFFFF;
    border: 1px solid #F3F4F6;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  `,
  itemImage: `
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #F3F4F6;
  `,
  totalSection: `
    background-color: #F9FAFB;
    border-radius: 8px;
    padding: 16px;
    margin-top: 20px;
  `,
  totalAmount: `
    font-size: 22px;
    font-weight: bold;
    color: #111827;
    margin: 8px 0;
  `,
  button: `
    display: inline-block;
    background-color: #E11D48;
    color: white;
    font-weight: bold;
    padding: 12px 24px;
    border-radius: 6px;
    text-decoration: none;
    margin: 16px 0;
  `,
  footer: `
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #E5E7EB;
    text-align: center;
  `,
  footerText: `
    font-size: 12px;
    color: #6B7280;
  `,
  footerLink: `
    color: #E11D48;
    text-decoration: underline;
  `
};

// Base email template that uses table-based layout for better email client compatibility
export const baseTemplate = (content) => `
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
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Welcome email template - Enhanced version
export const welcomeEmailTemplate = ({ userName }) => {
  const content = `
    <!-- Header -->
    <tr>
      <td style="${styles.header}">
        <h1 style="${styles.headerText}">KnitKart.in</h1>
      </td>
    </tr>
    
    <!-- Main content area -->
    <tr>
      <td style="padding: 40px 30px;">
        <!-- Welcome heading -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center">
              <h1 style="${styles.mainHeading}; margin-top: 0;">Welcome to KnitKart! 🧶</h1>
              <p style="${styles.bodyText}; text-align: center;">We're thrilled to have you join our community of crochet enthusiasts</p>
            </td>
          </tr>
        </table>
        
        <!-- Personalized greeting -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
          <tr>
            <td>
              <p style="${styles.bodyText}">Dear ${userName},</p>
              <p style="${styles.bodyText}">
                Welcome to the KnitKart family! You've just joined India's premier marketplace for 
                beautiful, handcrafted crochet creations. Every piece you'll find here is made with 
                love by talented Indian artisans.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- What makes us special -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0 20px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">What Makes KnitKart Special</h2>
            </td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding-left: 20px;">
              <p style="${styles.featureText}">✨ <strong>Handmade by Real Artists</strong> - Every item is crafted with care and attention to detail</p>
              <p style="${styles.featureText}">🇮🇳 <strong>Support Indian Artisans</strong> - Your purchase directly supports creative entrepreneurs</p>
              <p style="${styles.featureText}">🎨 <strong>Unique, One-of-a-Kind Pieces</strong> - Find items you won't see anywhere else</p>
              <p style="${styles.featureText}">💝 <strong>Made with Love</strong> - Each creation tells a story</p>
            </td>
          </tr>
        </table>
        
        <!-- Quick start guide -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0 20px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">Get Started</h2>
            </td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td>
              <p style="${styles.bodyText}">Here's how to make the most of your KnitKart experience:</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px;">
                <tr>
                  <td style="padding: 16px; background-color: #FDF2F8; border-radius: 8px; margin-bottom: 12px;">
                    <p style="${styles.featureText}; margin: 0;"><strong>1. Browse Our Collection</strong></p>
                    <p style="font-size: 14px; color: #6B7280; margin: 4px 0 0 0;">Discover beautiful crochet items from home decor to fashion accessories</p>
                  </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                  <td style="padding: 16px; background-color: #FDF2F8; border-radius: 8px; margin-bottom: 12px;">
                    <p style="${styles.featureText}; margin: 0;"><strong>2. Meet Our Creators</strong></p>
                    <p style="font-size: 14px; color: #6B7280; margin: 4px 0 0 0;">Follow your favorite artists and see their latest creations</p>
                  </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                  <td style="padding: 16px; background-color: #FDF2F8; border-radius: 8px;">
                    <p style="${styles.featureText}; margin: 0;"><strong>3. Save Your Favorites</strong></p>
                    <p style="font-size: 14px; color: #6B7280; margin: 4px 0 0 0;">Create a wishlist of items you love</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- CTA Button -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
          <tr>
            <td align="center">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://knitkart.in'}/shop" style="${styles.button}">
                Start Shopping
              </a>
            </td>
          </tr>
        </table>
        
        <!-- Join Community -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0 20px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">Join Our Community</h2>
            </td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td>
              <p style="${styles.bodyText}">Connect with us and stay updated on new arrivals, creator stories, and crochet inspiration:</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px;">
                <tr>
                  <td align="center" style="padding: 12px;">
                    <a href="https://www.instagram.com/knitkart.in/" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                      <span style="display: inline-block; background-color: #E11D48; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px;">
                        📸 Follow on Instagram
                      </span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 12px;">
                    <a href="https://www.facebook.com/people/Knitkartin/61574881434675/" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                      <span style="display: inline-block; background-color: #E11D48; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px;">
                        👍 Like on Facebook
                      </span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 12px;">
                    <a href="https://www.youtube.com/@knitkart" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                      <span style="display: inline-block; background-color: #E11D48; color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px;">
                        ▶️ Subscribe on YouTube
                      </span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Support -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
          <tr>
            <td>
              <p style="${styles.bodyText}">
                Have questions? Simply reply to this email and we'll be happy to help!
              </p>
              <p style="${styles.bodyText}; margin-top: 30px;">
                Happy shopping, and thank you for supporting handmade!
              </p>
              <p style="${styles.bodyText}">
                Warm regards,<br>
                <span style="font-weight: 600;">The KnitKart Team</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="${styles.footer}; padding: 20px 30px 40px;">
        <p style="${styles.footerText}">
          Questions? Simply reply to this email or contact us at <a href="mailto:knottedwithlove0@gmail.com" style="${styles.footerLink}">knottedwithlove0@gmail.com</a>
        </p>
        <p style="${styles.footerText}">
          © ${new Date().getFullYear()} KnitKart.in. All rights reserved.
        </p>
      </td>
    </tr>
  `;

  return baseTemplate(content);
};

// Order confirmation email template
export const orderConfirmationTemplate = ({ userName, orderNumber, items, total }) => {
  const content = `
    <!-- Header with logo and brand color -->
    <tr>
      <td style="${styles.header}">
        <h1 style="${styles.headerText}">Knitkart.in</h1>
      </td>
    </tr>
    
    <!-- Main content area -->
    <tr>
      <td style="padding: 40px 30px;">
        <!-- Order confirmation heading -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center">
              <h1 style="${styles.mainHeading}; margin-top: 0;">Your Order is Confirmed</h1>
              <p style="${styles.bodyText}; text-align: center;">Thank you for shopping with us! 🧶</p>
            </td>
          </tr>
        </table>
        
        <!-- Personalized greeting -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
          <tr>
            <td>
              <p style="${styles.bodyText}">Hello ${userName},</p>
              <p style="${styles.bodyText}">
                We're delighted to confirm your order <span style="${styles.orderNumber}">#${orderNumber}</span> has been received and is being processed. 
                We've included a summary of your purchase below.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Order summary section -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0 20px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">Order Summary</h2>
            </td>
          </tr>
        </table>
        
        <!-- Order Items with enhanced styling -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${items.map(item => `
            <tr>
              <td style="${styles.itemCard}">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td width="80" valign="top" style="padding-right: 15px;">
                      ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" style="${styles.itemImage}">` : ''}
                    </td>
                    <td valign="top">
                      <p style="${styles.featureText}; font-weight: 600; margin-top: 0;">${item.name}</p>
                      <p style="font-size: 14px; color: #6B7280; margin: 4px 0;">
                        <span style="color: #374151;">Quantity:</span> ${item.quantity} × <span style="${styles.highlightText}">₹${item.price}</span>
                      </p>
                      ${item.isMadeToOrder ? `
                        <p style="font-size: 14px; color: #E11D48; margin: 8px 0; background-color: #FDF2F8; padding: 4px 8px; border-radius: 4px; display: inline-block;">
                          <span style="font-weight: 600;">Made to Order</span> - Estimated delivery in ${item.madeToOrderDays} days
                        </p>
                      ` : ''}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          `).join('')}
        </table>
        
        <!-- Order total with enhanced styling -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="${styles.totalSection}">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="right">
                    <p style="font-size: 16px; color: #6B7280; margin: 0;">Order Total:</p>
                    <p style="${styles.totalAmount}">₹${total}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Next steps and tracking info -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 30px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">What's Next?</h2>
              <p style="${styles.bodyText}">
                We're preparing your order for shipment. You'll receive another email with tracking information once your order ships.
              </p>
              <p style="${styles.bodyText}">
                If you have any questions about your order, please don't hesitate to contact our customer service team.
              </p>
              
              <p style="${styles.bodyText}; margin-top: 30px;">
                Thank you for choosing handcrafted crochet products from Knitkart.in!
              </p>
              
              <p style="${styles.bodyText}">
                Warm regards,<br>
                <span style="font-weight: 600;">The Knitkart.in Team</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="${styles.footer}; padding: 20px 30px 40px;">
        <p style="${styles.footerText}">
          Questions? Contact our customer service team at <a href="mailto:knottedwithlove0@gmail.com" style="${styles.footerLink}">knottedwithlove0@gmail.com</a>
        </p>
        <p style="${styles.footerText}">
          © ${new Date().getFullYear()} Knitkart.in. All rights reserved.
        </p>
      </td>
    </tr>
  `;

  return baseTemplate(content);
};

// Seller order notification email template
export const sellerOrderNotificationTemplate = ({ sellerName, orderNumber, items, total, sellerAmount, platformFee, buyerName, shippingDetails }) => {
  const content = `
    <!-- Header with logo and brand color -->
    <tr>
      <td style="${styles.header}">
        <h1 style="${styles.headerText}">Knitkart.in Seller Orders</h1>
      </td>
    </tr>
    
    <!-- Main content area -->
    <tr>
      <td style="padding: 40px 30px;">
        <!-- Order notification heading -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center">
              <h1 style="${styles.mainHeading}; margin-top: 0;">New Order Received</h1>
              <p style="${styles.bodyText}; text-align: center;">You have a new sale! 🎉</p>
            </td>
          </tr>
        </table>
        
        <!-- Personalized greeting -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
          <tr>
            <td>
              <p style="${styles.bodyText}">Hello ${sellerName},</p>
              <p style="${styles.bodyText}">
                Good news! You've received a new order <span style="${styles.orderNumber}">#${orderNumber}</span> from ${buyerName}.
                Please review the order details below.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Order summary section -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0 20px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">Order Details</h2>
            </td>
          </tr>
        </table>
        
        <!-- Order Items with enhanced styling -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${items.map(item => `
            <tr>
              <td style="${styles.itemCard}">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td width="80" valign="top" style="padding-right: 15px;">
                      ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}" style="${styles.itemImage}">` : ''}
                    </td>
                    <td valign="top">
                      <p style="${styles.featureText}; font-weight: 600; margin-top: 0;">${item.name}</p>
                      <p style="font-size: 14px; color: #6B7280; margin: 4px 0;">
                        <span style="color: #374151;">Quantity:</span> ${item.quantity} × <span style="${styles.highlightText}">₹${item.price}</span>
                      </p>
                      ${item.isMadeToOrder ? `
                        <p style="font-size: 14px; color: #E11D48; margin: 8px 0; background-color: #FDF2F8; padding: 4px 8px; border-radius: 4px; display: inline-block;">
                          <span style="font-weight: 600;">Made to Order</span> - Expected completion in ${item.madeToOrderDays} days
                        </p>
                      ` : ''}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          `).join('')}
        </table>
        
        <!-- Order total with enhanced styling -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="${styles.totalSection}">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="${styles.totalAmount}; margin-bottom: 8px;">Order Summary</p>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="font-size: 16px; color: #374151;">Order Total:</td>
                        <td align="right" style="font-size: 16px; font-weight: 600; color: #111827;">₹${total}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 16px; color: #047857; padding-top: 8px;">Your Earnings:</td>
                        <td align="right" style="font-size: 16px; font-weight: 600; color: #047857; padding-top: 8px;">₹${sellerAmount}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #6B7280; padding-top: 4px;">Platform Fee:</td>
                        <td align="right" style="font-size: 14px; color: #6B7280; padding-top: 4px;">₹${platformFee}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Shipping Address -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 30px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">Shipping Address</h2>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F9FAFB; border-radius: 8px; padding: 16px; margin-top: 12px;">
                <tr>
                  <td>
                    <p style="${styles.featureText}; margin-top: 0;">${shippingDetails.address}</p>
                    <p style="${styles.featureText}; margin-bottom: 0;">${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.pincode}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Next steps -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 30px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">Next Steps</h2>
              <p style="${styles.bodyText}">
                Please prepare and ship this order as soon as possible. If any items are made to order, 
                ensure they are completed within the expected timeframe.
              </p>
              <p style="${styles.bodyText}">
                Remember to update the order status in your seller dashboard once you've shipped the items.
              </p>
              
              <p style="${styles.bodyText}; margin-top: 30px;">
                Thank you for being a valued seller on Knitkart.in!
              </p>
              
              <p style="${styles.bodyText}">
                Warm regards,<br>
                <span style="font-weight: 600;">The Knitkart.in Team</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="${styles.footer}; padding: 20px 30px 40px;">
        <p style="${styles.footerText}">
          Questions? Contact us at <a href="mailto:knottedwithlove0@gmail.com" style="${styles.footerLink}">knottedwithlove0@gmail.com</a>
        </p>
        <p style="${styles.footerText}">
          © ${new Date().getFullYear()} Knitkart.in. All rights reserved.
        </p>
      </td>
    </tr>
  `;

  return baseTemplate(content);
};
