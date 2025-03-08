import Link from 'next/link';

export const metadata = {
  title: 'Pricing Policy | KnitKart',
  description: 'Official pricing policy of KnitKart - Understand our pricing structure, taxes, and payment methods.',
};

export default function PricingPolicy() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-5xl lg:text-7xl text-gray-900 mb-4">Pricing Policy</h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Last updated: March 9, 2023
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Product Pricing</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            All prices on KnitKart are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless otherwise stated. The pricing of products on KnitKart is determined by various factors including but not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Material costs and quality used in the creation of crochet products</li>
            <li>Complexity and time investment required for handcrafting each piece</li>
            <li>Artist's expertise and craftsmanship</li>
            <li>Seasonal demand and availability</li>
            <li>Operational costs including logistics, platform maintenance, and customer service</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Price Display</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            The price displayed for each product includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Base price of the handcrafted item</li>
            <li>Applicable Goods and Services Tax (GST) as per the current government regulations</li>
            <li>Any applicable discounts will be clearly displayed on the product page</li>
          </ul>
          <p className="text-lg sm:text-xl">
            Shipping costs are not included in the displayed price and will be calculated separately at checkout based on your delivery location and the selected shipping method.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Special Pricing & Discounts</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            KnitKart may offer special pricing, promotions, and discounts from time to time. Terms and conditions for such offers will be clearly communicated alongside the offer details.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Promotional codes must be applied at checkout to avail applicable discounts</li>
            <li>Discounts may have minimum purchase requirements or other conditions</li>
            <li>Discounts cannot be combined unless specifically stated</li>
            <li>KnitKart reserves the right to modify or withdraw offers at any time</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Custom Orders</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            Custom-made crochet items are priced individually based on:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Complexity of the design</li>
            <li>Materials requested</li>
            <li>Time required for creation</li>
            <li>Customization details</li>
          </ul>
          <p className="text-lg sm:text-xl">
            A detailed quote will be provided before production begins, and payment terms for custom orders may differ from standard products.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Price Changes</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            KnitKart reserves the right to change prices at any time. However:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>If you have already placed an order, the price at the time of order confirmation will be honored</li>
            <li>Price changes will not affect orders that have already been confirmed</li>
            <li>Whenever possible, we will provide advance notice of significant price changes</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Payment Methods</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            KnitKart accepts the following payment methods:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Credit Cards (Visa, MasterCard, American Express, RuPay)</li>
            <li>Debit Cards</li>
            <li>Net Banking</li>
            <li>UPI Payments</li>
            <li>Razorpay Payment Gateway</li>
            <li>Digital Wallets (Google Pay, PhonePe, Paytm)</li>
          </ul>
          <p className="text-lg sm:text-xl">
            All payments are processed securely through our payment partners. KnitKart does not store your complete payment information.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Invoicing</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            A digital invoice will be provided for all purchases made on KnitKart. The invoice will contain:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Itemized list of products purchased</li>
            <li>Price breakdown including base price and taxes</li>
            <li>Shipping charges if applicable</li>
            <li>Discounts applied if any</li>
            <li>Total amount paid</li>
            <li>GST details as required by law</li>
          </ul>
        </div>
      </section>

      <div className="border-t border-gray-200 pt-8 mt-8">
        <p className="text-gray-600 text-lg">
          For any questions regarding our pricing policy, please {" "}
          <Link href="/contact" className="text-rose-600 hover:text-rose-700 transition-colors">
            contact our customer support
          </Link>.
        </p>
      </div>
    </div>
  );
}
