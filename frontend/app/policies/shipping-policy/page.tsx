import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-[#33475b]">Shipping Policy</h1>
      <div className="prose max-w-none text-[#5f6b7b]">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">Processing Time</h2>
          <p>Orders are typically processed within 1-2 business days.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">Shipping Methods</h2>
          <p>We offer standard and express shipping options across India through reliable courier partners.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">Delivery Time</h2>
          <p>Standard shipping: 5-7 business days<br />Express shipping: 2-3 business days</p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
