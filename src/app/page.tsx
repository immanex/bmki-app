import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Star, Users } from "lucide-react";
import CountdownTimer from "@/components/home/CountdownTimer";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-bmki-purple/20 to-neutral-950/90 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-bmki-purple/30 rounded-full blur-[120px] z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-bmki-gold/10 text-bmki-gold border border-bmki-gold/20 text-sm font-semibold tracking-wider mb-6">
              THE YOUTH CREATIVE PLATFORM
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-6">
              Elevating <span className="text-transparent bg-clip-text bg-gradient-to-r from-bmki-gold to-yellow-200">Creativity</span>
              <br /> Empowering Youth.
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
              Join the movement. BMKI is Ahmadu Bello University's premier event brand and talent showcase. Get ready for Season 6.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/events" 
                className="w-full sm:w-auto px-8 py-4 bg-bmki-gold text-bmki-purple font-bold rounded-full hover:bg-white hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Get Season 6 Tickets <ArrowRight size={20} />
              </Link>
              <Link 
                href="/talent-portal" 
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-bmki-purple transition-all"
              >
                Join the Talent Portal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 bg-bmki-purple relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Season 6 is Coming</h2>
            <p className="text-bmki-gold text-xl">The biggest creative showcase in ABU Zaria</p>
          </div>
          
          <CountdownTimer />
        </div>
      </section>

      {/* Features Highlights */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 dark:text-white">What We Do</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              BMKI is more than just an event. We are a platform that nurtures talent, provides entertainment, and builds a community of creatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Star className="text-bmki-purple w-8 h-8" />,
                title: "Talent Discovery",
                desc: "We provide a stage for upcoming artists, dancers, and creatives to showcase their skills to a massive audience."
              },
              {
                icon: <Calendar className="text-bmki-purple w-8 h-8" />,
                title: "Epic Events",
                desc: "Experience high-energy performances, immersive setups, and unforgettable moments at our seasonal showcases."
              },
              {
                icon: <Users className="text-bmki-purple w-8 h-8" />,
                title: "Creative Community",
                desc: "Connect with like-minded individuals, industry professionals, and brands looking to collaborate."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-800 hover:border-bmki-gold/50 transition-colors group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <div className="w-16 h-16 bg-bmki-gold/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
