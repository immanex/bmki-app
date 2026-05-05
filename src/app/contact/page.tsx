"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-20 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <section className="py-20 text-center px-4">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold text-neutral-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Get in <span className="text-bmki-purple dark:text-bmki-gold">Touch</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Have questions about Season 6, talent management, or partnerships? We'd love to hear from you.
        </motion.p>
      </section>

      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info & Map */}
          <div>
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-neutral-800 mb-8">
              <h3 className="text-2xl font-bold mb-6 dark:text-white">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bmki-purple/10 text-bmki-purple dark:bg-bmki-gold/10 dark:text-bmki-gold rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg dark:text-white">Location</h4>
                    <p className="text-gray-600 dark:text-gray-400">Ahmadu Bello University (ABU), Zaria, Kaduna State, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bmki-purple/10 text-bmki-purple dark:bg-bmki-gold/10 dark:text-bmki-gold rounded-full flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg dark:text-white">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-400">+234 (0) 800 000 0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bmki-purple/10 text-bmki-purple dark:bg-bmki-gold/10 dark:text-bmki-gold rounded-full flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg dark:text-white">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400">info@bmkiofficial.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed Placeholder */}
            <div className="w-full h-[300px] bg-gray-200 dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-lg">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15668.618683533827!2d7.639343716942065!3d11.144458399587425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e7436b7b7e28b%3A0xc316c02ef1bb9e5!2sAhmadu%20Bello%20University!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-neutral-900 p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 dark:border-neutral-800">
            <h3 className="text-2xl font-bold mb-8 dark:text-white">Send us a Message</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple focus:border-bmki-purple dark:text-white outline-none transition-all" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple focus:border-bmki-purple dark:text-white outline-none transition-all" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple focus:border-bmki-purple dark:text-white outline-none transition-all" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple focus:border-bmki-purple dark:text-white outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button type="button" className="w-full py-4 bg-bmki-purple text-white font-bold rounded-xl hover:bg-bmki-purple/90 transition-colors shadow-lg">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
