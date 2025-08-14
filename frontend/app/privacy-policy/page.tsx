import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2 text-[#33475b]">Privacy Policy – NE CRAFTERS</h1>
      <p className="text-sm text-[#5f6b7b] mb-8">Last updated: 13 August 2025</p>
      
      <div className="prose max-w-none text-[#5f6b7b] space-y-8">
        <p>
          At NE CRAFTERS, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you interact with our website, products, or services.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">1. Information We Collect</h2>
          <p className="mb-4">We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal details such as your name, email address, phone number, and billing/shipping address.</li>
            <li>Transaction details when you make a purchase from us.</li>
            <li>Technical information such as your IP address, browser type, and device information.</li>
            <li>Usage data about how you interact with our website or services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">2. How We Use Your Information</h2>
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfill your orders.</li>
            <li>Provide customer support and respond to inquiries.</li>
            <li>Improve our products, services, and website.</li>
            <li>Send promotional materials and updates (only if you opt in).</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">3. Sharing of Information</h2>
          <p className="mb-4">We do not sell, rent, or trade your personal information to third parties. We may share your data only with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Service providers who assist in operating our business (e.g., payment processors, shipping companies).</li>
            <li>Legal authorities if required by law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can choose to disable cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">5. Data Security</h2>
          <p>
            We take appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">6. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access, update, or delete your personal information.</li>
            <li>Withdraw consent for marketing communications at any time.</li>
            <li>Request a copy of the data we hold about you.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">7. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#33475b]">9. Contact Us</h2>
          <p className="mb-4">If you have any questions about this Privacy Policy or how we handle your data, please contact us:</p>
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

export default PrivacyPolicy;
