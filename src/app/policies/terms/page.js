import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | KnitKart',
  description: 'Official terms and conditions of KnitKart - Read about your rights and obligations when using our platform.',
};

export default function TermsAndConditions() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-5xl lg:text-7xl text-gray-900 mb-4">Terms and Conditions</h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Last updated: March 9, 2023
        </p>
      </header>
      
      <section className="space-y-4 text-gray-600">
        <p className="text-lg sm:text-xl">
          Welcome to KnitKart. By accessing or using our website, you agree to be bound by these Terms and Conditions. 
          Please read them carefully. If you do not agree with any part of these terms, you may not use our services.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">1. Definitions</h2>
        <div className="space-y-4 text-gray-600">
          <ul className="list-disc pl-6 space-y-3 text-lg sm:text-xl">
            <li><strong>"KnitKart,"</strong> "we," "us," or "our" refers to the KnitKart platform, its owners, operators, and affiliated entities.</li>
            <li><strong>"Services"</strong> refers to all features, content, applications, and services offered through our website.</li>
            <li><strong>"User,"</strong> "you," or "your" refers to any individual who accesses or uses our website.</li>
            <li><strong>"Seller"</strong> refers to any individual or entity that offers crochet products for sale on our platform.</li>
            <li><strong>"Products"</strong> refers to the handcrafted crochet items available for purchase on KnitKart.</li>
            <li><strong>"Content"</strong> refers to all text, images, videos, reviews, and other materials displayed on our website.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">2. Account Registration and User Obligations</h2>
        <div className="space-y-4 text-gray-600">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">2.1 Account Creation</h3>
          <p className="text-lg sm:text-xl">
            To make purchases on KnitKart, you may need to create an account. When creating an account, you must provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">2.2 User Responsibilities</h3>
          <p className="text-lg sm:text-xl">
            You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Use the platform for lawful purposes only</li>
            <li>Not engage in any activity that may disrupt or interfere with the proper functioning of our services</li>
            <li>Provide accurate information for order processing and delivery</li>
            <li>Not attempt to access restricted areas of the website</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">2.3 Account Termination</h3>
          <p className="text-lg sm:text-xl">
            KnitKart reserves the right to suspend or terminate your account at our discretion if you violate these Terms and Conditions or engage in any activity deemed harmful to the platform or other users.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">3. Products and Services</h2>
        <div className="space-y-4 text-gray-600">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">3.1 Product Information</h3>
          <p className="text-lg sm:text-xl">
            We strive to provide accurate product descriptions, images, and pricing. However, we do not guarantee that product descriptions or other content on our website are error-free, complete, or current. As handcrafted items, products may have slight variations in color, texture, or appearance from the displayed images.
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">3.2 Pricing and Availability</h3>
          <p className="text-lg sm:text-xl">
            All prices are in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices and product availability without prior notice. In case of pricing errors, we reserve the right to cancel orders and issue refunds.
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">3.3 Custom Orders</h3>
          <p className="text-lg sm:text-xl">
            For custom-made crochet items, specific terms regarding design, timeline, and pricing will be agreed upon before production begins. These specific terms will supplement these general Terms and Conditions.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">4. Orders and Payments</h2>
        <div className="space-y-4 text-gray-600">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">4.1 Order Placement</h3>
          <p className="text-lg sm:text-xl">
            By placing an order, you confirm that you intend to enter into a binding agreement to purchase the selected products. All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">4.2 Payment Processing</h3>
          <p className="text-lg sm:text-xl">
            We use Razorpay, a secure third-party payment processor, to handle transactions. By making a purchase, you agree to their terms of service and privacy policy. KnitKart does not store complete payment information.
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">4.3 Order Confirmation</h3>
          <p className="text-lg sm:text-xl">
            After placing an order, you will receive an order confirmation email. This email confirms that we have received your order but does not constitute acceptance of your order. An order is accepted only when we send you a shipping confirmation email.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">5. Shipping and Delivery</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            Detailed information regarding shipping methods, timeframes, and charges can be found in our{" "}
            <Link href="/policies/shipping" className="text-rose-600 hover:text-rose-700 transition-colors">
              Shipping Policy
            </Link>. By placing an order, you agree to the terms outlined in this policy.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">6. Returns and Refunds</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            Our return and refund procedures are detailed in our{" "}
            <Link href="/policies/cancellation-refund" className="text-rose-600 hover:text-rose-700 transition-colors">
              Cancellation/Refund Policy
            </Link>. By making a purchase, you agree to the terms outlined in this policy.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">7. Intellectual Property Rights</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            All content on KnitKart, including but not limited to logos, designs, text, graphics, images, software, and the selection and arrangement thereof, is the property of KnitKart or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p className="text-lg sm:text-xl">
            You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any material from our website without our express written consent.
          </p>
          <p className="text-lg sm:text-xl">
            Product designs offered by sellers on our platform are their intellectual property. Purchasing a product does not transfer any design rights to the buyer.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">8. User Content</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            When you submit reviews, comments, suggestions, or other content on our platform:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>You affirm that you own or have the necessary rights to such content</li>
            <li>You grant KnitKart a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, publish, and display such content</li>
            <li>You agree not to post content that is illegal, abusive, threatening, defamatory, or otherwise objectionable</li>
          </ul>
          <p className="text-lg sm:text-xl">
            KnitKart reserves the right to remove any user content at our discretion without prior notice.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">9. Limitation of Liability</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            KnitKart and its affiliates, officers, employees, agents, and partners shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Your use or inability to use our services</li>
            <li>Any products purchased or obtained through our platform</li>
            <li>Unauthorized access to or alteration of your data</li>
            <li>Statements or conduct of any third party on our website</li>
            <li>Any other matter relating to our services</li>
          </ul>
          <p className="text-lg sm:text-xl">
            In no event shall our total liability to you for all damages, losses, or causes of action exceed the amount paid by you to KnitKart for your most recent purchase.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">10. Indemnification</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            You agree to indemnify, defend, and hold harmless KnitKart, its affiliates, officers, directors, employees, agents, and suppliers from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Your use of our website or services</li>
            <li>Your violation of these Terms and Conditions</li>
            <li>Your violation of any rights of a third party</li>
            <li>Your user content</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">11. Governing Law and Jurisdiction</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any dispute arising under these terms shall be subject to the exclusive jurisdiction of the courts in [City], India.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">12. Changes to Terms and Conditions</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            KnitKart reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any such changes constitutes your acceptance of the new Terms and Conditions.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">13. Severability</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            If any provision of these Terms and Conditions is held to be invalid or unenforceable, such provision shall be struck from these terms and the remaining provisions shall remain in full force and effect.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">14. Contact Information</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <ul className="list-none space-y-2 text-lg sm:text-xl">
            <li>Email: support@knitkart.com</li>
            <li>Phone: +91-XXXXXXXXXX</li>
            <li>Address: [Your Business Address]</li>
          </ul>
        </div>
      </section>

      <div className="border-t border-gray-200 pt-8 mt-8">
        <p className="text-gray-600 text-lg">
          By using KnitKart, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
        </p>
      </div>
    </div>
  );
}
