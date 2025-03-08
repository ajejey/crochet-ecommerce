import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | KnitKart',
  description: 'Official privacy policy of KnitKart - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-5xl lg:text-7xl text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Last updated: March 9, 2023
        </p>
      </header>

      <section className="space-y-4 text-gray-600">
        <p className="text-lg sm:text-xl">
          At KnitKart, we are committed to protecting your privacy and ensuring the security of your personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
          or make a purchase. Please read this policy carefully to understand our practices regarding your personal data.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Information We Collect</h2>
        <div className="space-y-4 text-gray-600">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Personal Information</h3>
          <p className="text-lg sm:text-xl">
            We may collect personally identifiable information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Register for an account</li>
            <li>Place an order</li>
            <li>Subscribe to our newsletter</li>
            <li>Contact our customer service</li>
            <li>Participate in promotions or surveys</li>
            <li>Post reviews or comments</li>
          </ul>
          <p className="text-lg sm:text-xl">
            The personal information we collect may include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Shipping and billing address</li>
            <li>Payment information (processed securely through our payment processor)</li>
            <li>Account preferences</li>
            <li>Order history</li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6">Non-Personal Information</h3>
          <p className="text-lg sm:text-xl">
            We may automatically collect certain non-personal information when you visit our website, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Operating system</li>
            <li>Pages visited and time spent</li>
            <li>Referring website</li>
            <li>Geographic location (country/city level)</li>
          </ul>
          <p className="text-lg sm:text-xl">
            This information helps us analyze trends, administer the site, track users' movements, and gather demographic information for aggregate use.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">How We Use Your Information</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            We use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Process and fulfill your orders</li>
            <li>Create and manage your account</li>
            <li>Provide customer support</li>
            <li>Send transactional emails (order confirmations, shipping updates)</li>
            <li>Send marketing communications (if you've opted in)</li>
            <li>Improve our website and services</li>
            <li>Personalize your shopping experience</li>
            <li>Analyze usage patterns and trends</li>
            <li>Prevent fraudulent transactions and monitor security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Cookies and Similar Technologies</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            We use cookies, pixel tags, web beacons, and similar technologies on our website to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Remember your preferences and settings</li>
            <li>Understand how you interact with our website</li>
            <li>Provide personalized content and advertisements</li>
            <li>Analyze the performance of our website</li>
            <li>Improve user experience</li>
          </ul>
          <p className="text-lg sm:text-xl">
            You can manage your cookie preferences through your browser settings. However, disabling certain cookies may limit your ability to use some features of our website.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Information Sharing and Disclosure</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            We may share your personal information in the following situations:
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Service Providers</h3>
          <p className="text-lg sm:text-xl">
            We may share your information with third-party service providers who perform services on our behalf, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Payment processors (Razorpay)</li>
            <li>Shipping and logistics partners</li>
            <li>Customer service providers</li>
            <li>Analytics services</li>
            <li>Email marketing platforms</li>
          </ul>
          <p className="text-lg sm:text-xl">
            These service providers have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6">Business Transfers</h3>
          <p className="text-lg sm:text-xl">
            If KnitKart is involved in a merger, acquisition, or sale of all or a portion of its assets, your personal information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our website of any change in ownership or uses of your personal information.
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6">Legal Requirements</h3>
          <p className="text-lg sm:text-xl">
            We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6">Protection of Rights</h3>
          <p className="text-lg sm:text-xl">
            We may disclose your information when we believe disclosure is necessary to protect our rights, property, or safety, or that of our users or others.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Data Security</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
          <p className="text-lg sm:text-xl">
            Our security measures include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Secure Socket Layer (SSL) technology for all transactions</li>
            <li>PCI-DSS compliance for payment processing</li>
            <li>Regular security assessments and updates</li>
            <li>Limited access to personal information</li>
            <li>Employee training on privacy and security practices</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Data Retention</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            We will retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
          <p className="text-lg sm:text-xl">
            To determine the appropriate retention period, we consider:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>The amount, nature, and sensitivity of the personal information</li>
            <li>The potential risk of harm from unauthorized use or disclosure</li>
            <li>The purposes for which we process the information</li>
            <li>Whether we can achieve those purposes through other means</li>
            <li>Applicable legal requirements</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Your Rights and Choices</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            You have certain rights regarding your personal information, including:
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Access and Update</h3>
          <p className="text-lg sm:text-xl">
            You can access and update your personal information by logging into your account settings on our website.
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-4">Marketing Communications</h3>
          <p className="text-lg sm:text-xl">
            You can opt out of receiving marketing communications from us by clicking the "unsubscribe" link in our emails or by contacting us directly.
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-4">Cookies</h3>
          <p className="text-lg sm:text-xl">
            You can set your browser to refuse all or some browser cookies or to alert you when cookies are being sent.
          </p>
          
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-4">Data Subject Rights</h3>
          <p className="text-lg sm:text-xl">
            Depending on your location, you may have additional rights under applicable data protection laws, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>The right to request access to your personal information</li>
            <li>The right to request correction of inaccurate information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to object to or restrict processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent at any time</li>
          </ul>
          <p className="text-lg sm:text-xl">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Children's Privacy</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will take steps to delete such information.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Third-Party Links</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            Our website may contain links to third-party websites or services that are not owned or controlled by KnitKart. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services. We encourage you to review the privacy policies of any websites you visit.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Changes to this Privacy Policy</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Contact Us</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <ul className="list-none space-y-2 text-lg sm:text-xl">
            <li>Email: privacy@knitkart.com</li>
            <li>Phone: +91-XXXXXXXXXX</li>
            <li>Address: [Your Business Address]</li>
          </ul>
        </div>
      </section>

      <div className="border-t border-gray-200 pt-8 mt-8">
        <p className="text-gray-600 text-lg">
          By using our website, you consent to our Privacy Policy and agree to its terms.
        </p>
      </div>
    </div>
  );
}
