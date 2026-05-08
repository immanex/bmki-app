"use client";

import { motion } from "framer-motion";
import { Headphones, Camera, Sparkles, UserCheck, Video, Presentation } from "lucide-react";
import Link from "next/link";

const servicesList = [
  {
    title: "Event Production",
    description: "End-to-end planning and execution of high-octane events, concerts, and fashion shows.",
    icon: <Presentation className="w-6 h-6" />
  },
  {
    title: "Talent Management",
    description: "Scouting, grooming, and promoting artists, models, and creatives to reach their full potential.",
    icon: <UserCheck className="w-6 h-6" />
  },
  {
    title: "Media Coverage",
    description: "Professional photography and videography services to capture your best moments.",
    icon: <Camera className="w-6 h-6" />
  },
  {
    title: "Content Creation",
    description: "High-quality digital content production for brands, artists, and social media campaigns.",
    icon: <Video className="w-6 h-6" />
  },
  {
    title: "Entertainment Consulting",
    description: "Expert advice on creative direction, stage management, and audience engagement.",
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    title: "Audio Production",
    description: "Studio sessions, mixing, mastering, and sound engineering for emerging artists.",
    icon: <Headphones className="w-6 h-6" />
  }
];

export default function ServicesPage() {
  return (
    <div className="pt-20 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* Header */}
      <section className="py-12 sm:py-16 text-center px-4">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Our <span className="text-bmki-purple dark:text-bmki-gold">Services</span>
        </motion.h1>
        <motion.p 
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Delivering premium entertainment, talent management, and creative solutions.
        </motion.p>
      </section>

      {/* Services Grid */}
      <section className="pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {servicesList.map((service, idx) => (
            <motion.div
              key={idx}
              className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-neutral-800 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="w-14 h-14 bg-bmki-purple/5 text-bmki-purple dark:bg-bmki-gold/10 dark:text-bmki-gold rounded-2xl flex items-center justify-center mb-6 group-hover:bg-bmki-purple group-hover:text-white dark:group-hover:bg-bmki-gold dark:group-hover:text-bmki-purple transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-bmki-purple text-center px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">Need a custom creative solution?</h2>
        <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
          Partner with us to bring your creative vision to life. From brand activations to custom talent sourcing, we have you covered.
        </p>
        <a
          href="https://wa.me/2349058718400?text=I%20want%20to%20inquire%20about%20your%20services"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-bmki-gold text-bmki-purple font-bold rounded-full hover:bg-white hover:scale-105 transition-all shadow-lg inline-block"
        >
          Contact Us on WhatsApp
        </a>
      </section>
    </div>
  );
}
