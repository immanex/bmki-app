"use client";

import Link from "next/link";
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-bold text-bmki-gold tracking-wider">BMKI</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Empowering youth, elevating creativity, and shaping the future of entertainment in Nigeria.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-bmki-gold transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-bmki-gold transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-bmki-gold transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-bmki-gold transition-colors">
                <FaYoutube size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block text-bmki-gold">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white transition-colors">Events (Season 6)</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Our Services</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block text-bmki-gold">Contact Info</h3>
            <ul className="space-y-3 text-gray-400">
              <li>ABU Zaria, Kaduna State</li>
              <li>info@bmkiofficial.com</li>
              <li>+234 (0) 800 000 0000</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 inline-block text-bmki-gold">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and event news.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-neutral-800 border border-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:border-bmki-gold focus:ring-1 focus:ring-bmki-gold"
                required
              />
              <button 
                type="submit" 
                className="bg-bmki-purple hover:bg-bmki-purple/80 text-white font-medium px-4 py-2 rounded-md transition-colors border border-bmki-purple hover:border-bmki-gold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} BMKI Official. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
