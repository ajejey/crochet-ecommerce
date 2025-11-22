// Import shared email template utilities
import { styles, baseTemplate } from './email-templates.js';

// Seller welcome email template (sent when seller registers)
export const sellerWelcomeEmailTemplate = ({ sellerName, businessName }) => {
    const content = `
    <!-- Header -->
    <tr>
      <td style="${styles.header}">
        <h1 style="${styles.headerText}">KnitKart Seller Community</h1>
      </td>
    </tr>
    
    <!-- Main content area -->
    <tr>
      <td style="padding: 40px 30px;">
        <!-- Congratulations heading -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center">
              <h1 style="${styles.mainHeading}; margin-top: 0;">🎉 Welcome to KnitKart!</h1>
              <p style="${styles.bodyText}; text-align: center; font-size: 18px; color: #E11D48; font-weight: 600;">
                You're now part of the KnitKart seller family
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Personalized greeting -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
          <tr>
            <td>
              <p style="${styles.bodyText}">Dear ${sellerName},</p>
              <p style="${styles.bodyText}">
                Congratulations on taking the first step to share your beautiful crochet creations with the world! 
                We're thrilled to welcome <strong>${businessName}</strong> to India's premier handmade crochet marketplace.
              </p>
              <p style="${styles.bodyText}">
                Your application is currently under review. We carefully review each seller to ensure the highest 
                quality for our customers. This process typically takes 24-48 hours.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- What happens next -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0 20px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">What Happens Next?</h2>
            </td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
                <tr>
                  <td>
                    <p style="${styles.featureText}; margin: 0;"><strong>📋 Step 1: Application Review (24-48 hours)</strong></p>
                    <p style="font-size: 14px; color: #6B7280; margin: 8px 0 0 0;">
                      Our team will review your application. We're looking for passionate creators who make quality products.
                    </p>
                  </td>
                </tr>
              </table>
              
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F9FAFB; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
                <tr>
                  <td>
                    <p style="${styles.featureText}; margin: 0;"><strong>✅ Step 2: Approval Notification</strong></p>
                    <p style="font-size: 14px; color: #6B7280; margin: 8px 0 0 0;">
                      Once approved, you'll receive an email with access to your seller dashboard.
                    </p>
                  </td>
                </tr>
              </table>
              
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F9FAFB; border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <p style="${styles.featureText}; margin: 0;"><strong>🚀 Step 3: Start Selling</strong></p>
                    <p style="font-size: 14px; color: #6B7280; margin: 8px 0 0 0;">
                      Add your products, set up your shop, and start reaching customers across India!
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Get ready checklist -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0 20px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">Get Ready While You Wait</h2>
            </td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="padding-left: 20px;">
              <p style="${styles.featureText}">📸 <strong>Prepare Product Photos</strong> - Take clear, well-lit photos of your best work</p>
              <p style="${styles.featureText}">💭 <strong>Think About Your First 5 Products</strong> - What will you list first?</p>
              <p style="${styles.featureText}">🏦 <strong>Bank Account Details</strong> - Have your account info ready for payments</p>
              <p style="${styles.featureText}">📝 <strong>Product Descriptions</strong> - Think about what makes your items special</p>
            </td>
          </tr>
        </table>
        
        <!-- Support section -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0 20px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">We're Here to Help</h2>
            </td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td>
              <p style="${styles.bodyText}">
                Have questions? Need help preparing? Simply reply to this email and we'll get back to you within 24 hours. 
                We're committed to your success!
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Inspiration -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #FDF2F8; border-radius: 8px; padding: 20px;">
          <tr>
            <td>
              <p style="${styles.bodyText}; margin: 0; font-style: italic; color: #E11D48;">
                "Your creations deserve to be seen. We're here to help you reach customers who will love and appreciate your work."
              </p>
              <p style="font-size: 14px; color: #6B7280; margin: 12px 0 0 0; text-align: right;">
                - The KnitKart Team
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Closing -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
          <tr>
            <td>
              <p style="${styles.bodyText}">
                We'll be in touch soon with your approval status. In the meantime, start dreaming about your shop!
              </p>
              <p style="${styles.bodyText}; margin-top: 30px;">
                Warm regards,<br>
                <span style="font-weight: 600;">The KnitKart Seller Support Team</span>
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

// Seller approval email template (sent when seller is approved)
export const sellerApprovalEmailTemplate = ({ sellerName, businessName, shopSlug }) => {
    const shopUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://knitkart.in'}/creators/${shopSlug}`;
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://knitkart.in'}/seller`;

    const content = `
    <!-- Header -->
    <tr>
      <td style="${styles.header}">
        <h1 style="${styles.headerText}">KnitKart Seller Community</h1>
      </td>
    </tr>
    
    <!-- Main content area -->
    <tr>
      <td style="padding: 40px 30px;">
        <!-- Celebration heading -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center">
              <h1 style="${styles.mainHeading}; margin-top: 0;">🎊 You're Approved!</h1>
              <p style="${styles.bodyText}; text-align: center; font-size: 20px; color: #E11D48; font-weight: 600;">
                Your seller account is now ACTIVE
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Personalized greeting -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
          <tr>
            <td>
              <p style="${styles.bodyText}">Dear ${sellerName},</p>
              <p style="${styles.bodyText}">
                Congratulations! <strong>${businessName}</strong> has been approved to sell on KnitKart. 
                You can now start adding products and reaching customers across India!
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Your shop URL -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
          <tr>
            <td style="background-color: #FDF2F8; border-radius: 8px; padding: 20px; border: 2px solid #E11D48;">
              <p style="${styles.featureText}; margin: 0 0 8px 0; text-align: center;"><strong>Your Shop URL:</strong></p>
              <p style="font-size: 16px; color: #E11D48; margin: 0; text-align: center; word-break: break-all;">
                <a href="${shopUrl}" style="color: #E11D48; text-decoration: underline;">${shopUrl}</a>
              </p>
              <p style="font-size: 14px; color: #6B7280; margin: 12px 0 0 0; text-align: center;">
                Share this link with your friends, family, and on social media!
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Dashboard access -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0 20px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">Access Your Seller Dashboard</h2>
            </td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td>
              <p style="${styles.bodyText}">
                Your seller dashboard is your command center. Here you can:
              </p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px; padding-left: 20px;">
                <tr><td><p style="${styles.featureText}">✨ Add and manage products</p></td></tr>
                <tr><td><p style="${styles.featureText}">📦 Track orders and sales</p></td></tr>
                <tr><td><p style="${styles.featureText}">💰 View your earnings</p></td></tr>
                <tr><td><p style="${styles.featureText}">📊 See performance analytics</p></td></tr>
                <tr><td><p style="${styles.featureText}">⚙️ Customize your shop profile</p></td></tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- CTA Button -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
          <tr>
            <td align="center">
              <a href="${dashboardUrl}" style="${styles.button}">
                Go to Seller Dashboard
              </a>
            </td>
          </tr>
        </table>
        
        <!-- First product checklist -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0 20px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">Add Your First Product</h2>
            </td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td>
              <p style="${styles.bodyText}">Here's a quick checklist to get your first product live:</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px;">
                <tr>
                  <td style="padding: 12px; background-color: #F9FAFB; border-radius: 8px; margin-bottom: 8px;">
                    <p style="${styles.featureText}; margin: 0;">☑️ Upload 3-5 high-quality photos</p>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px; background-color: #F9FAFB; border-radius: 8px; margin-bottom: 8px;">
                    <p style="${styles.featureText}; margin: 0;">☑️ Write a compelling product description</p>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px; background-color: #F9FAFB; border-radius: 8px; margin-bottom: 8px;">
                    <p style="${styles.featureText}; margin: 0;">☑️ Set a competitive price</p>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px; background-color: #F9FAFB; border-radius: 8px;">
                    <p style="${styles.featureText}; margin: 0;">☑️ Add inventory and shipping details</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Share your shop -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0 20px;">
          <tr>
            <td>
              <h2 style="${styles.sectionHeading}">Spread the Word</h2>
            </td>
          </tr>
        </table>
        
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td>
              <p style="${styles.bodyText}">
                Share your shop on social media to get your first customers! Here's what to post:
              </p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px; background-color: #FDF2F8; border-radius: 8px; padding: 16px;">
                <tr>
                  <td>
                    <p style="font-size: 14px; color: #374151; margin: 0; font-style: italic;">
                      "Excited to announce that ${businessName} is now live on KnitKart! 🧶✨<br><br>
                      Check out my handmade crochet creations: ${shopUrl}<br><br>
                      #Crochet #Handmade #KnitKart #SupportSmallBusiness"
                    </p>
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
                Need help getting started? Have questions? Simply reply to this email and we'll assist you personally.
              </p>
              <p style="${styles.bodyText}; margin-top: 30px;">
                We're excited to see your creations come to life on KnitKart!
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
