"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, Ticket } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="pt-20 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 bg-bmki-purple overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Our Events
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Experience the pinnacle of youth entertainment. Secure your tickets for the most anticipated events of the year.
          </motion.p>
        </div>
      </section>

      {/* Featured Event: Season 6 */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-800 flex flex-col lg:flex-row">
            
            {/* Image Side */}
            <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-full bg-neutral-800">
              {/* Fallback pattern if images are not fully loaded */}
              <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,#4A148C_25%,transparent_25%,transparent_75%,#4A148C_75%,#4A148C),linear-gradient(45deg,#4A148C_25%,transparent_25%,transparent_75%,#4A148C_75%,#4A148C)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-bmki-gold font-bold text-4xl opacity-50 tracking-widest">SEASON 6</span>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm font-semibold mb-6 w-max">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Upcoming Featured Event
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">BMKI Season 6</h2>
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-6">
                The biggest creative showcase is back! Get ready for a night of electrifying performances, runway shows, and unmatched energy. You do not want to miss this.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                  <div className="w-10 h-10 rounded-full bg-bmki-purple/10 flex items-center justify-center text-bmki-purple dark:text-bmki-gold">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-medium">December 31, 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                  <div className="w-10 h-10 rounded-full bg-bmki-purple/10 flex items-center justify-center text-bmki-purple dark:text-bmki-gold">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">Time</p>
                    <p className="font-medium">6:00 PM Prompt</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                  <div className="w-10 h-10 rounded-full bg-bmki-purple/10 flex items-center justify-center text-bmki-purple dark:text-bmki-gold">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-500 dark:text-gray-400">Venue</p>
                    <p className="font-medium">Blue Roof, ABU Zaria</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-gray-100 dark:border-neutral-800 pt-6">
                <div className="flex-1 w-full">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ticket Price</p>
                  <p className="text-2xl md:text-3xl font-bold dark:text-white">{'₦1,000'}</p>
                </div>
                <a
                  href="https://wa.me/2349058718400?text=I%20want%20to%20buy%20a%20ticket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-bmki-purple text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-bmki-gold hover:text-bmki-purple transition-colors shadow-lg"
                >
                  <Ticket size={18} />
                  Buy Ticket via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
