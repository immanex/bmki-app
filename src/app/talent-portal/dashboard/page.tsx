"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { User, LogOut, Briefcase, Mic2, Star, ChevronRight, Settings, Image as ImageIcon, Bell } from "lucide-react";
import type { TalentProfile } from "@/types";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [stats, setStats] = useState({ portfolioCount: 0, applicationCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/talent-portal");
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      // 1. Get Profile
      const docSnap = await getDoc(doc(db, "talents", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data() as TalentProfile;
        setProfile(data);
        
        // If profile isn't somewhat complete, nudge them
        if ((data.profileComplete || 0) < 30) {
           router.push("/talent-portal/onboarding");
           return;
        }
      }

      // 2. Get Stats (Portfolio items & Applications)
      const portQ = query(collection(db, "portfolio"), where("uid", "==", user.uid));
      const portSnap = await getDocs(portQ);
      
      const appQ = query(collection(db, "applications"), where("uid", "==", user.uid));
      const appSnap = await getDocs(appQ);

      setStats({
        portfolioCount: portSnap.size,
        applicationCount: appSnap.size
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    router.push("/talent-portal");
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-bmki-purple border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 hidden lg:flex flex-col fixed h-[calc(100vh-8rem)]">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-lg border border-gray-100 dark:border-neutral-800 p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-bmki-purple/10 text-bmki-purple dark:bg-bmki-gold/10 dark:text-bmki-gold rounded-full flex items-center justify-center font-bold text-xl">
              {profile?.fullName?.charAt(0) || user?.email?.charAt(0) || "T"}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold dark:text-white truncate">{profile?.fullName || "Talent User"}</p>
              <p className="text-xs text-neutral-500 capitalize truncate">{profile?.talentType || "Creative"}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { name: "Dashboard", href: "/talent-portal/dashboard", icon: <User size={20} />, active: true },
              { name: "My Portfolio", href: "/talent-portal/portfolio", icon: <ImageIcon size={20} />, active: false },
              { name: "Auditions", href: "/talent-portal/auditions", icon: <Mic2 size={20} />, active: false },
              { name: "Edit Profile", href: "/talent-portal/profile", icon: <Settings size={20} />, active: false },
            ].map(item => (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  item.active 
                  ? "bg-bmki-purple text-white shadow-md" 
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium mt-auto"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 max-w-5xl">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold dark:text-white mb-2">Welcome back, {profile?.fullName?.split(" ")[0] || "Creative"}! 👋</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Here's what's happening with your BMKI profile today.</p>
          </div>
          
          <button className="relative p-3 bg-white dark:bg-neutral-900 rounded-full shadow-sm border border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-bmki-purple transition-colors hidden sm:block">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900"></span>
          </button>
        </header>

        {/* Profile Completion Nudge */}
        {(profile?.profileComplete || 0) < 100 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-bmki-purple to-purple-800 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Complete your profile!</h3>
                <p className="text-purple-200 max-w-lg mb-4">You are currently at {profile?.profileComplete || 0}% completion. A complete profile increases your chances of getting selected for auditions.</p>
                <div className="w-full bg-black/20 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div className="bg-bmki-gold h-2.5 rounded-full" style={{ width: `${profile?.profileComplete || 0}%` }}></div>
                </div>
              </div>
              <Link 
                href="/talent-portal/profile" 
                className="shrink-0 px-6 py-3 bg-bmki-gold text-bmki-purple font-bold rounded-xl shadow-lg hover:bg-white transition-colors"
              >
                Complete Now
              </Link>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-gray-100 dark:border-neutral-800 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
              <ImageIcon size={28} />
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Portfolio Items</p>
              <h4 className="text-3xl font-bold dark:text-white">{stats.portfolioCount}</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-gray-100 dark:border-neutral-800 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
              <Briefcase size={28} />
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Applications</p>
              <h4 className="text-3xl font-bold dark:text-white">{stats.applicationCount}</h4>
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-gray-100 dark:border-neutral-800 shadow-sm flex items-center gap-5 sm:col-span-2 lg:col-span-1">
            <div className="w-14 h-14 bg-bmki-gold/10 text-bmki-gold rounded-2xl flex items-center justify-center shrink-0">
              <Star size={28} />
            </div>
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Profile Views</p>
              <h4 className="text-3xl font-bold dark:text-white">--</h4>
            </div>
          </div>
        </div>

        {/* Quick Actions / Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/talent-portal/auditions" className="group block bg-neutral-900 dark:bg-neutral-800 rounded-3xl p-8 text-white relative overflow-hidden transition-transform hover:-translate-y-1">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
              <Mic2 size={160} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Find Opportunities</h3>
            <p className="text-gray-400 mb-6 max-w-[80%]">Apply for Season 6 slots, fashion shows, and more exclusive BMKI events.</p>
            <span className="inline-flex items-center gap-2 text-bmki-gold font-semibold group-hover:gap-3 transition-all">
              Browse Auditions <ChevronRight size={18} />
            </span>
          </Link>

          <Link href="/talent-portal/portfolio" className="group block bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-gray-100 dark:border-neutral-800 relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <h3 className="text-2xl font-bold mb-2 dark:text-white">Update Portfolio</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Upload your latest videos, pictures, and tracks to showcase your skills.</p>
            <span className="inline-flex items-center gap-2 text-bmki-purple dark:text-bmki-gold font-semibold group-hover:gap-3 transition-all">
              Manage Portfolio <ChevronRight size={18} />
            </span>
          </Link>
        </div>

        {/* Mobile Navigation (Bottom Bar) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex justify-around p-3 z-50 pb-safe">
          <Link href="/talent-portal/dashboard" className="flex flex-col items-center p-2 text-bmki-purple dark:text-bmki-gold">
            <User size={24} />
            <span className="text-[10px] font-medium mt-1">Dashboard</span>
          </Link>
          <Link href="/talent-portal/portfolio" className="flex flex-col items-center p-2 text-neutral-500 hover:text-bmki-purple dark:hover:text-bmki-gold">
            <ImageIcon size={24} />
            <span className="text-[10px] font-medium mt-1">Portfolio</span>
          </Link>
          <Link href="/talent-portal/auditions" className="flex flex-col items-center p-2 text-neutral-500 hover:text-bmki-purple dark:hover:text-bmki-gold">
            <Mic2 size={24} />
            <span className="text-[10px] font-medium mt-1">Auditions</span>
          </Link>
          <Link href="/talent-portal/profile" className="flex flex-col items-center p-2 text-neutral-500 hover:text-bmki-purple dark:hover:text-bmki-gold">
            <Settings size={24} />
            <span className="text-[10px] font-medium mt-1">Profile</span>
          </Link>
        </div>

      </main>
    </div>
  );
}
