"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Partners", href: "/partners" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-bmki-purple/95 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-bmki-gold tracking-wider uppercase">BMKI</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white hover:text-bmki-gold transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex">
            <Link
              href="/talent-portal"
              className="bg-bmki-gold text-bmki-purple px-6 py-2 rounded-full font-bold hover:bg-white transition-colors shadow-lg hover:shadow-bmki-gold/50"
            >
              Talent Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-bmki-gold focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-bmki-purple shadow-xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-medium text-white hover:text-bmki-gold hover:bg-bmki-purple/80 rounded-md"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/talent-portal"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-4 bg-bmki-gold text-bmki-purple px-6 py-2 rounded-full font-bold hover:bg-white transition-colors"
            >
              Talent Portal
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
