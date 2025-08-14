import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2 text-[#33475b]">Refund Policy – NE CRAFTERS</h1>
      <p className="text-sm text-[#5f6b7b] mb-8">Last updated: 13 August 2025</p>
      
      <div className="prose max-w-none text-[#5f6b7b] space-y-8">
        <p>
          At NE CRAFTERS, we strive to provide our customers with high-quality products and services. If you are not fully satisfied with your purchase, this Refund Policy outlines the conditions under which we can offer a refund, exchange, or store credit.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">1. Eligibility for Refunds</h2>
          <p className="mb-4">To be eligible for a refund:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The item must be unused, in its original packaging, and in the same condition as received.</li>
            <li>You must contact us within 7 days of receiving your order.</li>
            <li>Proof of purchase (invoice/receipt) is required.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">2. Non-Refundable Items</h2>
          <p className="mb-4">We do not accept returns or issue refunds for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Custom-made or personalized items.</li>
            <li>Digital products or downloadable files.</li>
            <li>Items purchased on clearance or marked as "non-returnable."</li>
            <li>Products damaged due to misuse, mishandling, or improper care.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">3. Refund Process</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To request a refund, contact our support team at admin@necrafters.com or call +91 8011990818.</li>
            <li>After reviewing your request, we will provide instructions for returning the item.</li>
            <li>Once the returned item is received and inspected, we will notify you of the refund approval or rejection.</li>
            <li>Approved refunds will be processed to your original payment method within 7–10 business days.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">4. Exchanges</h2>
          <p>
            If your item arrives defective or damaged, you may request an exchange instead of a refund. Please contact us within 48 hours of delivery with photos of the damaged product.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">5. Shipping Costs</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Shipping charges are non-refundable.</li>
            <li>You are responsible for paying the return shipping costs unless the return is due to our error (e.g., wrong item shipped or defective product).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">6. Late or Missing Refunds</h2>
          <p className="mb-4">If you haven't received a refund after 10 business days:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Check your bank account again.</li>
            <li>Contact your credit card company or payment provider.</li>
            <li>If you still have not received your refund, contact us at admin@necrafters.com.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">7. Contact Us</h2>
          <p className="mb-4">For questions regarding our Refund Policy, please contact:</p>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="text-lg">📍</span> Location: Masarhat, Jorhat, Assam, India – 785001
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">📞</span> Phone No: +91 8011990818 (9:30 AM to 6:30 PM)
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">📧</span> Email: admin@necrafters.com
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;
