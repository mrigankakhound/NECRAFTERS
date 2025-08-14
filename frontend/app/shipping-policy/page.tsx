import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2 text-[#33475b]">Shipping Policy – NE CRAFTERS</h1>
      <p className="text-sm text-[#5f6b7b] mb-8">Last updated: 13 August 2025</p>
      
      <div className="prose max-w-none text-[#5f6b7b] space-y-8">
        <p>
          At NE CRAFTERS, we are dedicated to delivering your orders in a safe and timely manner. This Shipping Policy explains how we handle order processing, delivery times, and shipping charges.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">1. Order Processing</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Orders are processed within 1–3 business days after payment confirmation.</li>
            <li>Orders placed on weekends or public holidays will be processed on the next business day.</li>
            <li>Custom or made-to-order items may take additional time to process; customers will be informed of any extended timelines.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">2. Delivery Time</h2>
          <p className="mb-4">Estimated delivery times:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Within Assam: 3–5 business days</li>
            <li>Rest of India: 5–10 business days</li>
            <li>International Orders: 10–20 business days (depending on destination and customs clearance)</li>
          </ul>
          <p className="mt-4 text-sm italic">
            Please note: Delivery times may vary due to unforeseen delays such as weather conditions, strikes, or courier issues.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">3. Shipping Charges</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Shipping costs are calculated at checkout based on your location and order weight/size.</li>
            <li>Free shipping may be offered on promotional events or for orders above a specified amount.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">4. Tracking Your Order</h2>
          <p>
            Once your order is shipped, you will receive an email/SMS with a tracking number and a link to track your package.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">5. Delayed or Lost Shipments</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>If your shipment is delayed beyond the estimated delivery time, please contact us for assistance.</li>
            <li>If a package is lost in transit, we will coordinate with the courier service to resolve the issue and may offer a replacement or refund.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">6. Incorrect Address</h2>
          <p>
            Customers are responsible for providing accurate shipping details. NE CRAFTERS is not liable for orders shipped to incorrect addresses provided by the customer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">7. International Shipping & Customs</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>International orders may be subject to import duties, taxes, or customs fees, which are the customer's responsibility.</li>
            <li>Customs delays are beyond our control, and we cannot guarantee delivery dates for international shipments.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">8. Contact Us</h2>
          <p className="mb-4">For any shipping-related inquiries, please contact:</p>
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

export default ShippingPolicy;
