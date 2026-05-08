"use client";

import Link from "next/link";
import { Instagram as InstagramIcon, Twitter, Facebook, Youtube } from "lucide-react";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;
    setSubStatus("loading");
    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        email,
        createdAt: serverTimestamp(),
      });
      setSubStatus("success");
      setEmail("");
    } catch {
      setSubStatus("error");
    }
  };

  return (
    <footer className="bg-neutral-900 text-white pt-12 sm:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
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
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-bmki-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-bmki-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-bmki-gold transition-colors">
                <Youtube size={20} />
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
            <form className="flex flex-col space-y-2" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-neutral-800 border border-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:border-bmki-gold focus:ring-1 focus:ring-bmki-gold"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={subStatus === "loading"}
                className="bg-bmki-purple hover:bg-bmki-purple/80 text-white font-medium px-4 py-2 rounded-md transition-colors border border-bmki-purple hover:border-bmki-gold disabled:opacity-50"
              >
                {subStatus === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
              {subStatus === "success" && <p className="text-green-400 text-sm mt-1">Subscribed! 🎉</p>}
              {subStatus === "error" && <p className="text-red-400 text-sm mt-1">Failed to subscribe.</p>}
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
