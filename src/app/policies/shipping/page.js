import Link from 'next/link';

export const metadata = {
  title: 'Shipping Policy | KnitKart',
  description: 'Official shipping policy of KnitKart - Learn about our delivery processes, timelines, and charges.',
};

export default function ShippingPolicy() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-5xl lg:text-7xl text-gray-900 mb-4">Shipping Policy</h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Last updated: March 9, 2023
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Domestic Shipping</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            KnitKart delivers handcrafted crochet products across India. Our shipping partners ensure that your precious handmade items reach you safely and in perfect condition.
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Delivery Timeframes</h3>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li><strong>Metro Cities</strong> (Delhi NCR, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad): 2-4 business days</li>
            <li><strong>Tier 1 & Tier 2 Cities</strong>: 4-6 business days</li>
            <li><strong>Remote Areas</strong>: 7-10 business days</li>
            <li><strong>Custom-made Orders</strong>: Additional 7-14 days creation time before shipping begins</li>
          </ul>
          <p className="text-lg sm:text-xl">
            Please note that these timeframes are estimates and may vary based on unforeseen circumstances such as weather conditions, local restrictions, or high-volume periods.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Shipping Charges</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            Shipping charges are calculated based on:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Delivery location</li>
            <li>Package weight and dimensions</li>
            <li>Shipping method selected</li>
          </ul>
          <p className="text-lg sm:text-xl">
            The exact shipping charge will be calculated and displayed at checkout before payment is processed.
          </p>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-4">Free Shipping</h3>
          <p className="text-lg sm:text-xl">
            KnitKart offers free shipping on:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>All orders above ₹1999</li>
            <li>Special promotional periods (as announced)</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Order Processing</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            Each KnitKart order goes through the following process:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-lg sm:text-xl">
            <li><strong>Order Confirmation</strong>: An email confirmation is sent immediately after placing your order</li>
            <li><strong>Processing</strong>: Orders are typically processed within 24-48 hours (excluding weekends and holidays)</li>
            <li><strong>Quality Check</strong>: Each handcrafted item undergoes a thorough quality check</li>
            <li><strong>Packaging</strong>: Products are carefully packaged to ensure safe delivery</li>
            <li><strong>Dispatch</strong>: Once dispatched, you will receive a shipping confirmation with tracking details</li>
            <li><strong>Delivery</strong>: Our shipping partner delivers the package to your specified address</li>
          </ol>
          <p className="text-lg sm:text-xl">
            For custom-made items, we will keep you updated on the creation process before shipping begins.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Tracking Your Order</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            Once your order is dispatched, you can track it through:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>The tracking link provided in your shipping confirmation email</li>
            <li>Your KnitKart account under "My Orders" section</li>
            <li>Our customer support (for any tracking issues)</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">International Shipping</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            Currently, KnitKart does not offer international shipping. We are working on expanding our services globally and will update our shipping policy once international shipping becomes available.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Shipping Limitations</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            Please be aware of the following limitations:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>We cannot ship to P.O. boxes</li>
            <li>Restricted areas with limited delivery services may experience additional delays</li>
            <li>During major festivals, holidays, or unforeseen events, shipping times may be extended</li>
            <li>In rare cases, orders may be subject to customs or regulatory inspections which can delay delivery</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Damage During Transit</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            Although we take utmost care in packaging, if you receive a damaged product:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-lg sm:text-xl">
            <li>Document the damage with photographs</li>
            <li>Contact our customer support within 48 hours of delivery</li>
            <li>Our team will guide you through the replacement or refund process</li>
          </ol>
          <p className="text-lg sm:text-xl">
            Please inspect all deliveries at the time of receipt. If possible, record the unboxing process to document the condition of received items.
          </p>
        </div>
      </section>

      <div className="border-t border-gray-200 pt-8 mt-8">
        <p className="text-gray-600 text-lg">
          For any questions regarding our shipping policy, please {" "}
          <Link href="/contact" className="text-rose-600 hover:text-rose-700 transition-colors">
            contact our customer support
          </Link>.
        </p>
      </div>
    </div>
  );
}
