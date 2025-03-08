import ContactForm from './components/ContactForm';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with KnitKart. We\'d love to hear from you about custom orders, collaborations, or any questions you might have about our handcrafted crochet products.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Pattern Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5" />
        <div className="bg-gradient-to-b from-rose-50 via-white to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-serif text-5xl lg:text-7xl text-gray-900 mb-4">Get in Touch</h1>
              <p className="text-gray-600 text-lg mb-8">
                Have a question about our products or interested in a custom order? We'd love to hear from you!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information and Form Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-3xl text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Email</h3>
                  <a href="mailto:knottedwithlove0@gmail.com" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                    knottedwithlove0@gmail.com
                  </a>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Phone</h3>
                  <a href="tel:+919884299308" className="text-gray-600 hover:text-rose-600 transition-colors duration-200">
                    +91 9884299308
                  </a>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Saturday<br />
                    10:00 AM - 7:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-serif text-3xl text-gray-900 mb-6">Quick FAQs</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Custom Orders</h3>
                  <p className="text-gray-600">
                    Yes, we accept custom orders! Please fill out the form with your requirements.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Shipping Time</h3>
                  <p className="text-gray-600">
                    Standard shipping takes 5-7 business days within India.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-900 mb-2">Returns</h3>
                  <p className="text-gray-600">
                    We accept returns within 7 days of delivery for unused items.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
