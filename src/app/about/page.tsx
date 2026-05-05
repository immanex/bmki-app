"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Target, Lightbulb, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-20 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 text-center px-4">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold text-neutral-900 dark:text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          About <span className="text-bmki-purple dark:text-bmki-gold">BMKI</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          We are Ahmadu Bello University's premier platform for youth creativity, entertainment, and talent discovery.
        </motion.p>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-neutral-800"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 bg-bmki-purple/10 rounded-2xl flex items-center justify-center text-bmki-purple dark:text-bmki-gold mb-6">
              <Target size={28} />
            </div>
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              To empower the youth by providing a world-class platform where raw talent meets unparalleled opportunities. We aim to nurture creativity, build confidence, and showcase the best of youth entertainment to the world.
            </p>
          </motion.div>

          <motion.div 
            className="bg-bmki-purple text-white p-8 rounded-3xl shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-bmki-gold mb-6">
              <Lightbulb size={28} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              To become the leading youth-focused entertainment brand in Nigeria, recognized globally for excellence, innovation, and our contribution to the creative industry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white dark:bg-neutral-900 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="aspect-square bg-gray-200 dark:bg-neutral-800 rounded-3xl overflow-hidden relative">
                {/* Placeholder for About Image */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-bmki-purple/20 to-bmki-gold/20">
                  <span className="text-bmki-purple/50 dark:text-bmki-gold/30 font-bold text-2xl">BMKI Story</span>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white">The Journey So Far</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                What started as a small gathering of passionate creatives has evolved into the most anticipated event brand in ABU Zaria. Over the years, BMKI has successfully hosted 5 massive seasons, each bigger and better than the last.
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                From spectacular runway shows that highlight indigenous fashion, to music performances that leave the crowd breathless, our stage has been the launchpad for many successful careers in the entertainment industry.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-4xl font-extrabold text-bmki-purple dark:text-bmki-gold mb-2">5+</h3>
                  <p className="text-gray-500 font-medium">Seasons Hosted</p>
                </div>
                <div>
                  <h3 className="text-4xl font-extrabold text-bmki-purple dark:text-bmki-gold mb-2">10k+</h3>
                  <p className="text-gray-500 font-medium">Attendees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
