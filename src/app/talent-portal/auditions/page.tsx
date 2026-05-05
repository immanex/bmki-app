"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Clock, Users, X, Send, Award, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import type { Audition, Application, PortfolioItem } from "@/types";

// Seed data for auditions (in a real app, this comes from Firestore)
const mockAuditions: Audition[] = [
  {
    id: "aud_01",
    title: "BMKI Season 6 — Main Stage Performers",
    description: "We are looking for the most energetic and talented musicians and dancers to headline the main stage for Season 6. This is your chance to perform in front of 5000+ people.",
    deadline: "2026-11-30T23:59:59Z",
    talentTypes: ["music", "dance"],
    slots: 50,
    status: "open",
  },
  {
    id: "aud_02",
    title: "BMKI Runway Showcase — Models Needed",
    description: "Seeking 20 runway models for the exclusive Season 6 Fashion segment. Must be confident, charismatic, and ready to slay the runway.",
    deadline: "2026-10-15T23:59:59Z",
    talentTypes: ["fashion"],
    slots: 20,
    status: "closed",
  },
  {
    id: "aud_03",
    title: "Red Carpet Hosts",
    description: "Are you eloquent, witty, and great with people? We need 2 dynamic hosts for the Season 6 red carpet experience.",
    deadline: "2026-12-05T23:59:59Z",
    talentTypes: ["comedy", "content", "acting"],
    slots: 2,
    status: "open",
  }
];

export default function AuditionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [auditions, setAuditions] = useState<Audition[]>(mockAuditions);
  const [applications, setApplications] = useState<Application[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedAudition, setSelectedAudition] = useState<Audition | null>(null);
  const [statement, setStatement] = useState("");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/talent-portal");
    } else if (user) {
      fetchUserData();
    }
  }, [user, authLoading, router]);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      // Get Applications
      const appQ = query(collection(db, "applications"), where("uid", "==", user.uid));
      const appSnap = await getDocs(appQ);
      setApplications(appSnap.docs.map(d => ({ id: d.id, ...d.data() } as Application)));

      // Get Portfolio for dropdown
      const portQ = query(collection(db, "portfolio"), where("uid", "==", user.uid));
      const portSnap = await getDocs(portQ);
      setPortfolioItems(portSnap.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioItem)));
      
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user || !selectedAudition || statement.length < 50 || !selectedPortfolioId) return;
    setSubmitting(true);
    try {
      const newApp = {
        uid: user.uid,
        auditionId: selectedAudition.id,
        auditionTitle: selectedAudition.title,
        statement,
        portfolioItemId: selectedPortfolioId,
        status: "pending" as const,
        submittedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "applications"), newApp);
      
      // Update local state
      setApplications([{ id: docRef.id, ...newApp } as unknown as Application, ...applications]);
      
      // Close modal
      setSelectedAudition(null);
      setStatement("");
      setSelectedPortfolioId("");
      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  const hasApplied = (auditionId: string) => {
    return applications.some(app => app.auditionId === auditionId);
  };

  const getDaysRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-bmki-purple border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold dark:text-white mb-4">Open Auditions</h1>
          <p className="text-xl text-neutral-500 dark:text-neutral-400">Your chance to be part of something legendary. Apply for Season 6 slots.</p>
        </div>

        {/* Auditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auditions.map((audition) => {
            const daysLeft = getDaysRemaining(audition.deadline);
            const applied = hasApplied(audition.id);

            return (
              <div key={audition.id} className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-neutral-800 p-8 flex flex-col transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-wrap gap-2">
                    {audition.talentTypes.map(t => (
                      <span key={t} className="px-3 py-1 bg-bmki-purple/10 text-bmki-purple dark:bg-bmki-gold/10 dark:text-bmki-gold rounded-full text-xs font-bold uppercase tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${audition.status === "open" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {audition.status}
                  </span>
                </div>

                <h2 className="text-2xl font-bold dark:text-white mb-3 leading-tight">{audition.title}</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 flex-1">{audition.description}</p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <CalendarDays size={18} className={daysLeft <= 7 && audition.status === 'open' ? "text-red-500" : ""} />
                    <span className={daysLeft <= 7 && audition.status === 'open' ? "text-red-500 font-semibold" : ""}>
                      {audition.status === "closed" ? "Deadline Passed" : `${daysLeft} days remaining`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <Users size={18} />
                    <span>{audition.slots} Slots Available</span>
                  </div>
                </div>

                {applied ? (
                  <button disabled className="w-full py-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                    <CheckCircle2 size={20} /> Application Submitted
                  </button>
                ) : (
                  <button 
                    onClick={() => setSelectedAudition(audition)}
                    disabled={audition.status === "closed"}
                    className="w-full py-4 bg-bmki-purple text-white font-bold rounded-xl hover:bg-bmki-purple/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {audition.status === "open" ? "Apply Now" : "Closed"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* My Applications Section */}
        {applications.length > 0 && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-16">
            <h2 className="text-3xl font-bold dark:text-white mb-8 flex items-center gap-3">
              <Award className="text-bmki-gold" size={32} /> My Applications
            </h2>
            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                      <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-400">Audition</th>
                      <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-400">Date Applied</th>
                      <th className="p-4 font-semibold text-neutral-600 dark:text-neutral-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b border-neutral-100 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                        <td className="p-4 font-medium dark:text-white">{app.auditionTitle}</td>
                        <td className="p-4 text-neutral-500">{new Date(app.submittedAt?.toDate?.() || Date.now()).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex w-max items-center gap-1
                            ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500' : ''}
                            ${app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500' : ''}
                            ${app.status === 'selected' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500' : ''}
                            ${app.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500' : ''}
                          `}>
                            {app.status === 'pending' && <Clock size={12} />}
                            {app.status === 'selected' && <CheckCircle2 size={12} />}
                            {app.status === 'rejected' && <XCircle size={12} />}
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Application Modal */}
        <AnimatePresence>
          {selectedAudition && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => !submitting && setSelectedAudition(null)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white dark:bg-neutral-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-800/50">
                  <div>
                    <p className="text-xs font-bold text-bmki-purple dark:text-bmki-gold uppercase tracking-wider mb-1">Application For</p>
                    <h2 className="text-xl font-bold dark:text-white line-clamp-1">{selectedAudition.title}</h2>
                  </div>
                  <button onClick={() => !submitting && setSelectedAudition(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-neutral-800 shrink-0">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Statement of Purpose *</label>
                    <p className="text-xs text-neutral-500 mb-3">Why do you want to be part of this? What makes you stand out?</p>
                    <textarea 
                      value={statement} 
                      onChange={e => setStatement(e.target.value)} 
                      disabled={submitting}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple dark:text-white outline-none resize-none"
                      placeholder="I believe I am a great fit because..."
                    />
                    <div className="flex justify-end mt-1">
                      <span className={`text-xs ${statement.length < 50 ? 'text-red-500' : 'text-green-500'}`}>
                        {statement.length}/50 min chars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Select Portfolio Item to Submit *</label>
                    <p className="text-xs text-neutral-500 mb-3">Choose one piece from your portfolio that best showcases your talent for this audition.</p>
                    
                    {portfolioItems.length === 0 ? (
                      <div className="p-4 border-2 border-dashed border-red-300 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-xl text-red-600 dark:text-red-400 text-sm">
                        You don't have any portfolio items yet. Please upload a video or image to your portfolio first before applying.
                      </div>
                    ) : (
                      <select 
                        value={selectedPortfolioId}
                        onChange={e => setSelectedPortfolioId(e.target.value)}
                        disabled={submitting}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple dark:text-white outline-none"
                      >
                        <option value="" className="dark:bg-neutral-900">-- Select an item --</option>
                        {portfolioItems.map(item => (
                          <option key={item.id} value={item.id} className="dark:bg-neutral-900">
                            {item.title} ({item.type})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                  <button 
                    onClick={handleApply}
                    disabled={submitting || statement.length < 50 || !selectedPortfolioId}
                    className="w-full py-4 bg-bmki-gold text-bmki-purple font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? "Submitting Application..." : <><Send size={20} /> Submit Application</>}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
