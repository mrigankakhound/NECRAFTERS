import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-[#33475b]">Terms of Service</h1>
      <div className="prose max-w-none text-[#5f6b7b]">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">Agreement to Terms</h2>
          <p>By accessing our website and making purchases, you agree to these terms of service.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">Use of Service</h2>
          <p>Our services are intended for personal, non-commercial use unless explicitly agreed upon.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">Account Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account information.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
