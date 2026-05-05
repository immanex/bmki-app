"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";

export default function TalentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "talents", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        router.push("/talent-portal");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/talent-portal");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bmki-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
          <div className="bg-gradient-to-r from-bmki-purple to-purple-900 px-8 py-12 text-white">
            <h1 className="text-4xl font-bold mb-2">Welcome to your Portal!</h1>
            <p className="text-purple-100 text-lg">
              {userData?.fullName || user?.email || "Talent"}, we're glad to have you here.
            </p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-xl border border-neutral-100 dark:border-neutral-700">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Profile Information</h3>
                <div className="space-y-3">
                  <p className="text-neutral-600 dark:text-neutral-300">
                    <span className="font-medium text-neutral-900 dark:text-white">Email:</span> {user?.email}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    <span className="font-medium text-neutral-900 dark:text-white">Talent Type:</span> {userData?.talentType || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-xl border border-neutral-100 dark:border-neutral-700 flex flex-col justify-center items-center text-center">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">Next Steps</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Complete your portfolio and start exploring opportunities.
                </p>
                <button className="px-6 py-2 bg-bmki-gold text-neutral-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors">
                  Edit Portfolio
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={handleSignOut}
                className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
