"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import { Camera, Music, Activity, Star, Smile, Video, Palette, Plus, X } from "lucide-react";

const talentTypes = [
  { id: "music", label: "Music / Artist", icon: <Music className="w-8 h-8" /> },
  { id: "dance", label: "Dance / Choreography", icon: <Activity className="w-8 h-8" /> },
  { id: "fashion", label: "Fashion / Modeling", icon: <Star className="w-8 h-8" /> },
  { id: "comedy", label: "Comedy", icon: <Smile className="w-8 h-8" /> },
  { id: "content", label: "Content Creation", icon: <Video className="w-8 h-8" /> },
  { id: "acting", label: "Acting / Drama", icon: <Camera className="w-8 h-8" /> },
  { id: "visual", label: "Visual Art / Design", icon: <Palette className="w-8 h-8" /> },
  { id: "other", label: "Other Creative", icon: <Plus className="w-8 h-8" /> },
];

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [talentType, setTalentType] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "professional">("beginner");
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    tiktok: "",
    twitter: "",
    youtube: "",
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/talent-portal");
    } else if (user) {
      // Pre-fill if exists
      getDoc(doc(db, "talents", user.uid)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.fullName) setFullName(data.fullName);
          if (data.talentType) setTalentType(data.talentType);
        }
      });
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  const handleNext = () => setStep((s) => Math.min(4, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentSkill.trim() && skills.length < 10) {
      e.preventDefault();
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (indexToRemove: number) => {
    setSkills(skills.filter((_, i) => i !== indexToRemove));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhotoFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      let profilePhotoURL = "";

      // Upload photo if selected
      if (profilePhotoFile) {
        const storageRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}`);
        const uploadTask = await uploadBytesResumable(storageRef, profilePhotoFile);
        profilePhotoURL = await getDownloadURL(uploadTask.ref);
      }

      // Calculate completeness
      let filledFields = 0;
      if (fullName) filledFields++;
      if (talentType) filledFields++;
      if (bio) filledFields++;
      if (profilePhotoURL) filledFields++;
      if (skills.length > 0) filledFields++;
      if (Object.values(socialLinks).some(link => link)) filledFields++;
      
      const profileComplete = Math.round((filledFields / 6) * 100);

      await updateDoc(doc(db, "talents", user.uid), {
        fullName,
        talentType,
        bio,
        experienceLevel,
        skills,
        socialLinks,
        ...(profilePhotoURL && { profilePhotoURL }),
        profileComplete,
      });

      router.push("/talent-portal/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 flex flex-col items-center">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl px-4 mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
          <span>Step {step} of 4</span>
          <span>{step === 1 ? "Talent Type" : step === 2 ? "Profile Basics" : step === 3 ? "Skills & Socials" : "First Portfolio Item"}</span>
        </div>
        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-bmki-purple"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-2xl px-4 relative overflow-hidden flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="flex flex-col flex-1"
            >
              <h2 className="text-3xl font-bold mb-2">What is your primary talent?</h2>
              <p className="text-gray-400 mb-8">Select the category that best describes you.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {talentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setTalentType(type.id)}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${
                      talentType === type.id 
                        ? "border-bmki-gold bg-bmki-gold/10 text-bmki-gold" 
                        : "border-neutral-800 bg-neutral-900 text-gray-400 hover:border-neutral-600 hover:text-white"
                    }`}
                  >
                    <div className="mb-3">{type.icon}</div>
                    <span className="font-semibold">{type.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="flex flex-col flex-1 space-y-6"
            >
              <h2 className="text-3xl font-bold mb-2">Let's build your profile</h2>
              
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center mb-4 border-2 border-dashed border-neutral-600">
                  {profilePhotoPreview ? (
                    <img src={profilePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-10 h-10 text-neutral-500" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoSelect} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-sm text-gray-400">Upload a profile photo (optional)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-bmki-purple text-white"
                  placeholder="Your stage name or full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio ({bio.length}/200)</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 200))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-bmki-purple text-white resize-none"
                  rows={4}
                  placeholder="Tell us a bit about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
                <div className="flex gap-4">
                  {(["beginner", "intermediate", "professional"] as const).map((level) => (
                    <label key={level} className="flex-1 flex items-center p-3 border border-neutral-700 rounded-xl cursor-pointer hover:bg-neutral-800">
                      <input 
                        type="radio" 
                        name="exp" 
                        checked={experienceLevel === level}
                        onChange={() => setExperienceLevel(level)}
                        className="mr-3 text-bmki-purple focus:ring-bmki-purple"
                      />
                      <span className="capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="flex flex-col flex-1 space-y-6"
            >
              <h2 className="text-3xl font-bold mb-2">Skills & Socials</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills / Tags (Press Enter to add)</label>
                <input 
                  type="text" 
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={addSkill}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:border-bmki-purple text-white mb-3"
                  placeholder="e.g. Afrobeats, Beatmaker, Runway..."
                  disabled={skills.length >= 10}
                />
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-bmki-purple/20 text-bmki-purple border border-bmki-purple/30 rounded-full text-sm flex items-center gap-1">
                      {skill}
                      <button onClick={() => removeSkill(index)} className="hover:text-white ml-1">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <h3 className="text-xl font-semibold">Social Links</h3>
                
                {Object.keys(socialLinks).map((platform) => (
                  <div key={platform} className="flex items-center gap-4">
                    <span className="w-24 capitalize text-gray-400">{platform}</span>
                    <input 
                      type="text" 
                      value={socialLinks[platform as keyof typeof socialLinks]}
                      onChange={(e) => setSocialLinks({...socialLinks, [platform]: e.target.value})}
                      className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2 focus:outline-none focus:border-bmki-purple text-white text-sm"
                      placeholder={`@username or URL`}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="flex flex-col flex-1 space-y-6"
            >
              <h2 className="text-3xl font-bold mb-2">First Portfolio Item</h2>
              <p className="text-gray-400 mb-8">Let's show off what you can do. (You can skip this and upload later)</p>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 rounded-2xl p-12 bg-neutral-900 text-center hover:border-neutral-500 transition-colors">
                <Camera className="w-16 h-16 text-neutral-600 mb-4" />
                <h3 className="text-xl font-medium mb-2">Upload a Photo or Video</h3>
                <p className="text-gray-500 mb-6 max-w-sm">
                  We're building the portfolio upload page next. For now, you can skip this step!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full max-w-2xl px-4 mt-8 flex justify-between">
        {step > 1 ? (
          <button 
            onClick={handleBack}
            className="px-6 py-3 border border-neutral-700 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
          >
            Back
          </button>
        ) : <div />}

        {step < 4 ? (
          <button 
            onClick={handleNext}
            disabled={step === 1 && !talentType}
            className="px-8 py-3 bg-bmki-purple text-white rounded-xl font-bold hover:bg-bmki-purple/90 transition-colors disabled:opacity-50"
          >
            Continue
          </button>
        ) : (
          <div className="flex gap-4">
            <button 
              onClick={handleFinish}
              disabled={saving}
              className="px-6 py-3 text-gray-400 font-medium hover:text-white transition-colors"
            >
              Skip for now
            </button>
            <button 
              onClick={handleFinish}
              disabled={saving}
              className="px-8 py-3 bg-bmki-gold text-bmki-purple rounded-xl font-bold hover:bg-white transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Finish & View Profile"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
