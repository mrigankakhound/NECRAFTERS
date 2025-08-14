import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="ownContainer py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Have questions about our products or services? We'd love to hear from you.
          Contact us using any of the methods below.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {/* Location Card */}
        <div className="p-8 rounded-[2rem] bg-card border border-border/10 hover:border-accent/20 transition-colors duration-200 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-display font-bold text-primary mb-2">
            Our Location
          </h3>
          <p className="text-foreground/70">
            Masarhat, Jorhat,<br />
            Assam, India-785001
          </p>
        </div>

        {/* Phone Card */}
        <div className="p-8 rounded-[2rem] bg-card border border-border/10 hover:border-accent/20 transition-colors duration-200 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-display font-bold text-primary mb-2">
            Phone Number
          </h3>
          <a 
            href="tel:+918011990818" 
            className="text-foreground/70 hover:text-primary transition-colors"
          >
            +91 8011990818
          </a>
        </div>

        {/* Hours Card */}
        <div className="p-8 rounded-[2rem] bg-card border border-border/10 hover:border-accent/20 transition-colors duration-200 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-display font-bold text-primary mb-2">
            Operating Hours
          </h3>
          <p className="text-foreground/70">
            Monday - Saturday<br />
            9:30 AM - 6:30 PM
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-primary mb-4">
              Send Us a Message
            </h2>
            <p className="text-foreground/70">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                placeholder="Message subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
                placeholder="Your message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="rounded-[2rem] overflow-hidden shadow-xl h-[600px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14248.979221889786!2d94.18326728715824!3d26.76846539999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3746c1ea05beba8b%3A0x23f858357a9e4646!2sNE%20CRAFTERS!5e0!3m2!1sen!2sin!4v1754860196838!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-primary mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-foreground/70 mb-8">
          Can't find what you're looking for? Check our FAQ section or contact us directly.
        </p>
        <a 
          href="/faq"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Visit FAQ Page
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}