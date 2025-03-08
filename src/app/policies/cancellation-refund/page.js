import Link from 'next/link';

export const metadata = {
  title: 'Cancellation & Refund Policy | KnitKart',
  description: 'Official cancellation and refund policy of KnitKart - Learn about our return process, refund timelines, and exceptions.',
};

export default function CancellationRefundPolicy() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-5xl lg:text-7xl text-gray-900 mb-4">Cancellation & Refund Policy</h1>
        <p className="text-lg sm:text-xl text-gray-600">
          Last updated: March 9, 2023
        </p>
      </header>

      <section className="space-y-4 text-gray-600">
        <p className="text-lg sm:text-xl">
          At KnitKart, we want you to be completely satisfied with your purchase. We understand that sometimes you may need 
          to cancel an order or return a product. This policy outlines our procedures for cancellations, returns, and refunds.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Order Cancellation</h2>
        <div className="space-y-4 text-gray-600">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Before Dispatch</h3>
          <p className="text-lg sm:text-xl">
            You can cancel your order at any time before it has been dispatched without incurring any charges. To cancel an order:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-lg sm:text-xl">
            <li>Log into your KnitKart account</li>
            <li>Navigate to "My Orders" section</li>
            <li>Find the order you wish to cancel</li>
            <li>Click on the "Cancel Order" button</li>
            <li>Select a reason for cancellation from the dropdown menu</li>
            <li>Submit your cancellation request</li>
          </ol>
          <p className="text-lg sm:text-xl">
            Alternatively, you can contact our customer support team with your order number and cancellation request.
          </p>
          <p className="text-lg sm:text-xl">
            Once your cancellation request is received:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>You will receive an email confirming your cancellation request</li>
            <li>Our team will process your request within 24 hours</li>
            <li>If payment was already made, the refund will be initiated within 2 business days</li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6">After Dispatch</h3>
          <p className="text-lg sm:text-xl">
            Once your order has been dispatched, it cannot be cancelled directly. However, you can:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Refuse to accept the delivery when it arrives</li>
            <li>Return the product following our return procedure (detailed below)</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Returns</h2>
        <div className="space-y-4 text-gray-600">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Return Eligibility</h3>
          <p className="text-lg sm:text-xl">
            You may return products within 7 days of delivery if:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>The item is defective or damaged upon arrival</li>
            <li>The item received significantly differs from the description or images on our website</li>
            <li>You received an incorrect item</li>
            <li>The product has a manufacturing defect</li>
          </ul>
          <p className="text-lg sm:text-xl">
            Please note that due to the handcrafted nature of our products, slight variations in color, texture, or appearance from the displayed images are normal and do not qualify as valid reasons for return.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6">Non-Returnable Items</h3>
          <p className="text-lg sm:text-xl">
            The following items cannot be returned:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>Custom-made or personalized items (unless defective)</li>
            <li>Items that have been used, washed, or altered in any way</li>
            <li>Products with removed tags or packaging</li>
            <li>Items marked as "Final Sale" or "Non-Returnable"</li>
            <li>Discounted items with specified "No Return" policy</li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6">Return Procedure</h3>
          <p className="text-lg sm:text-xl">
            To initiate a return:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-lg sm:text-xl">
            <li>Contact our customer support within 7 days of receiving your order</li>
            <li>Provide your order number, the item(s) you wish to return, and the reason for return</li>
            <li>Take clear photographs of the issue if the return is due to damage or defect</li>
            <li>Our team will review your request and provide further instructions</li>
            <li>Once approved, you will receive a return authorization and shipping instructions</li>
            <li>Package the item in its original condition with all tags and packaging</li>
            <li>Ship the item to the provided address using a trackable shipping method</li>
          </ol>
          <p className="text-lg sm:text-xl">
            Upon receiving the returned item, our quality assurance team will inspect it to verify the reported issue. This process typically takes 2-3 business days.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Refunds</h2>
        <div className="space-y-4 text-gray-600">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Refund Process</h3>
          <p className="text-lg sm:text-xl">
            Once your return is approved and the item has been inspected:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>You will receive an email notification confirming your refund</li>
            <li>The refund will be processed to your original payment method</li>
            <li>For payments made through credit/debit cards or net banking, refunds typically reflect in your account within 5-7 business days</li>
            <li>For UPI or wallet payments, refunds typically reflect within 2-3 business days</li>
            <li>For Cash on Delivery (COD) orders, refunds will be processed to your bank account (you will need to provide your bank details)</li>
          </ul>
          <p className="text-lg sm:text-xl">
            Please note that the actual time for the refund to reflect in your account depends on your bank or payment provider's processing timelines, which are beyond our control.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6">Refund Amount</h3>
          <p className="text-lg sm:text-xl">
            Your refund will include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>The full price paid for the returned item(s)</li>
            <li>The original shipping charges (only if the return is due to our error, such as a defective or incorrect item)</li>
          </ul>
          <p className="text-lg sm:text-xl">
            Return shipping costs are borne by:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>KnitKart - if the return is due to a defect, damage, or our error</li>
            <li>Customer - for all other eligible returns</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Exchanges</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            We currently do not offer direct exchanges. If you wish to exchange an item:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-lg sm:text-xl">
            <li>Return the original item following our return procedure</li>
            <li>Place a new order for the desired item</li>
          </ol>
          <p className="text-lg sm:text-xl">
            Our customer support team can assist you with this process and may be able to expedite your new order.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Cancellation by KnitKart</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            KnitKart reserves the right to cancel an order under certain circumstances, including but not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>The item is out of stock or discontinued</li>
            <li>There was an error in pricing or product description</li>
            <li>We identify a potential fraudulent transaction</li>
            <li>We cannot ship to the provided address</li>
            <li>The order violates our Terms and Conditions</li>
          </ul>
          <p className="text-lg sm:text-xl">
            In such cases:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg sm:text-xl">
            <li>We will notify you via email or phone</li>
            <li>If payment was already made, a full refund will be processed within 2 business days</li>
            <li>When possible, we may offer alternative products or solutions</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Special Circumstances</h2>
        <div className="space-y-4 text-gray-600">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Sale Items</h3>
          <p className="text-lg sm:text-xl">
            Items marked as "Sale" or discounted may have modified return eligibility. Any special conditions will be clearly mentioned on the product page.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-4">Gifts</h3>
          <p className="text-lg sm:text-xl">
            If the item was marked as a gift at the time of purchase and shipped directly to the recipient, the recipient may receive a gift credit for the value of the return. Otherwise, the refund will be issued to the original purchaser.
          </p>

          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-4">Custom Orders</h3>
          <p className="text-lg sm:text-xl">
            For custom-made items, cancellation is only possible before production begins. Once production has started, cancellations are not accepted except in case of manufacturing defects.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Contact for Support</h2>
        <div className="space-y-4 text-gray-600">
          <p className="text-lg sm:text-xl">
            If you have any questions or concerns about our Cancellation & Refund Policy, please contact our customer support team at:
          </p>
          <ul className="list-none space-y-2 text-lg sm:text-xl">
            <li>Email: support@knitkart.com</li>
            <li>Phone: +91-XXXXXXXXXX</li>
            <li>Hours: Monday to Saturday, 9:00 AM to 6:00 PM IST</li>
          </ul>
          <p className="text-lg sm:text-xl">
            We're committed to providing a fair resolution to all concerns and will work with you to ensure your satisfaction.
          </p>
        </div>
      </section>

      <div className="border-t border-gray-200 pt-8 mt-8">
        <p className="text-gray-600 text-lg">
          This Cancellation & Refund Policy is subject to change without prior notice. Any changes will be effective immediately upon posting on the website.
        </p>
      </div>
    </div>
  );
}
