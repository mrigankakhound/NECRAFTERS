import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <>
      {/* Wave SVG - Exact match to the image */}
      <div className="w-full bg-white">
        <svg
          className="w-full"
          style={{ height: '120px' }}
          preserveAspectRatio="none"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="black"
            d="M0,80 C480,120 720,120 1440,80 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      <footer className="bg-black text-white pt-8 pb-4">
        <div className="ownContainer">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-16 gap-y-8">
            {/* Address Column */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C7.453 0 3.623 3.853 3.623 8.427c0 6.32 7.608 14.846 7.93 15.204L12 24l.447-.369c.322-.358 7.93-8.884 7.93-15.204C20.377 3.853 16.547 0 12 0zm0 12.5c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/>
                </svg>
                <p className="text-sm">
                Location: Masarhat, Jorhat, Assam, India-785001

                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.487 17.14l-4.065-3.696a1.001 1.001 0 00-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 00.043-1.391L6.859 3.513a1 1 0 00-1.391-.087l-2.17 1.861a1 1 0 00-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 00.648-.291l1.86-2.171a.997.997 0 00-.085-1.39z"/>
                </svg>
                <p className="text-sm">Phone No:  +91 8011990818 (9:30 AM to 6:30 PM)</p>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 001.228 0L20 9.044 20.002 18H4z"/>
                </svg>
                <p className="text-sm">admin@necrafters.com</p>
              </div>
            </div>

            {/* Explore Links */}
            <div>
              <h3 className="font-bold mb-4">EXPLORE</h3>
              <ul className="space-y-2">
                <li><Link href="/shop" className="text-sm">Shop</Link></li>
                <li><Link href="/recipes" className="text-sm">Recipes</Link></li>
                <li><Link href="/about-us" className="text-sm">About Us</Link></li>
                <li><Link href="/blog" className="text-sm">Blog</Link></li>
                <li><Link href="/contact-us" className="text-sm">Contact Us</Link></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-bold mb-4">SUPPORT</h3>
              <ul className="space-y-2">
                <li><Link href="/search" className="text-sm">Search</Link></li>
                <li><Link href="/privacy-policy" className="text-sm">Privacy Policy</Link></li>
                <li><Link href="/refund-policy" className="text-sm">Refund Policy</Link></li>
                <li><Link href="/shipping-policy" className="text-sm">Shipping Policy</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-bold mb-4">SIGN UP FOR DELIGHTS</h3>
              <p className="text-sm mb-4">
                Subscribe and receive exclusive offers, giveaways, and surprise deals on your favourite spices.
              </p>
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-neutral-900 border-0 text-white placeholder:text-white/70"
                />
                <Button className="w-full bg-white hover:bg-white/90 text-black">
                  SUBMIT
                </Button>
              </div>
              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                <Link href="https://www.facebook.com/people/Ne-Crafters/61573118997646/" className="text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </Link>
                <Link href="https://www.instagram.com/necrafters/" className="text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Link>
                <Link href="https://www.youtube.com/@necrafters" className="text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-4 border-t border-white/20 text-center text-sm">
            <p>COPYRIGHT © NE CRAFTERS 2025</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;