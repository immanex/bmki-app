"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import { Camera, X, Check, CheckCircle2 } from "lucide-react";

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "",
    talentType: "",
    bio: "",
    experienceLevel: "beginner",
    skills: [] as string[],
    socialLinks: { instagram: "", tiktok: "", twitter: "", youtube: "" },
    profilePhotoURL: "",
    isVerified: false,
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/talent-portal");
    } else if (user) {
      getDoc(doc(db, "talents", user.uid)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setProfileData({
            fullName: data.fullName || "",
            talentType: data.talentType || "",
            bio: data.bio || "",
            experienceLevel: data.experienceLevel || "beginner",
            skills: data.skills || [],
            socialLinks: {
              instagram: data.socialLinks?.instagram || "",
              tiktok: data.socialLinks?.tiktok || "",
              twitter: data.socialLinks?.twitter || "",
              youtube: data.socialLinks?.youtube || "",
            },
            profilePhotoURL: data.profilePhotoURL || "",
            isVerified: data.isVerified || false,
          });
          if (data.profilePhotoURL) setPhotoPreview(data.profilePhotoURL);
        }
        setLoading(false);
      });
    }
  }, [user, authLoading, router]);

  if (authLoading || loading || !user) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-bmki-purple border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentSkill.trim() && profileData.skills.length < 10) {
      e.preventDefault();
      setProfileData({ ...profileData, skills: [...profileData.skills, currentSkill.trim()] });
      setCurrentSkill("");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      let finalPhotoURL = profileData.profilePhotoURL;

      if (photoFile) {
        const storageRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}`);
        const uploadTask = await uploadBytesResumable(storageRef, photoFile);
        finalPhotoURL = await getDownloadURL(uploadTask.ref);
      }

      let filledFields = 0;
      if (profileData.fullName) filledFields++;
      if (profileData.talentType) filledFields++;
      if (profileData.bio) filledFields++;
      if (finalPhotoURL) filledFields++;
      if (profileData.skills.length > 0) filledFields++;
      if (Object.values(profileData.socialLinks).some(link => link)) filledFields++;
      const profileComplete = Math.round((filledFields / 6) * 100);

      await updateDoc(doc(db, "talents", user.uid), {
        ...profileData,
        profilePhotoURL: finalPhotoURL,
        profileComplete,
      });
      
      setProfileData(prev => ({ ...prev, profilePhotoURL: finalPhotoURL }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Preview */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-gray-100 dark:border-neutral-800 p-8 text-center sticky top-28">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-6 group bg-neutral-100 dark:bg-neutral-800 border-4 border-bmki-purple/20">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-neutral-400">
                  {profileData.fullName?.charAt(0) || user.email?.charAt(0)}
                </div>
              )}
              
              <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                <Camera className="w-8 h-8 text-white" />
                <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
              </label>
            </div>

            <h2 className="text-2xl font-bold dark:text-white flex items-center justify-center gap-2">
              {profileData.fullName || "Your Name"}
              {profileData.isVerified && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
            </h2>
            <p className="text-bmki-purple dark:text-bmki-gold font-medium mb-4 capitalize">
              {profileData.talentType || "Talent Type"} • {profileData.experienceLevel}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {profileData.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-sm rounded-full text-neutral-700 dark:text-neutral-300">
                  {skill}
                </span>
              ))}
            </div>

            <button className="w-full py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
              View Public Profile
            </button>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-gray-100 dark:border-neutral-800 p-8">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-neutral-800 pb-6">
              <h1 className="text-3xl font-bold dark:text-white">Edit Profile</h1>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-bmki-purple text-white font-bold rounded-xl hover:bg-bmki-purple/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? "Saving..." : saveSuccess ? <><Check size={18} /> Saved!</> : "Save Changes"}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.fullName}
                    onChange={e => setProfileData({...profileData, fullName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Talent Type</label>
                  <select 
                    value={profileData.talentType}
                    onChange={e => setProfileData({...profileData, talentType: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple dark:text-white outline-none"
                  >
                    <option value="" className="dark:bg-neutral-900">Select...</option>
                    <option value="music" className="dark:bg-neutral-900">Music / Artist</option>
                    <option value="dance" className="dark:bg-neutral-900">Dance / Choreography</option>
                    <option value="fashion" className="dark:bg-neutral-900">Fashion / Modeling</option>
                    <option value="comedy" className="dark:bg-neutral-900">Comedy</option>
                    <option value="content" className="dark:bg-neutral-900">Content Creation</option>
                    <option value="acting" className="dark:bg-neutral-900">Acting / Drama</option>
                    <option value="visual" className="dark:bg-neutral-900">Visual Art / Design</option>
                    <option value="other" className="dark:bg-neutral-900">Other Creative</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Bio</label>
                <textarea 
                  value={profileData.bio}
                  onChange={e => setProfileData({...profileData, bio: e.target.value.slice(0, 200)})}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple dark:text-white outline-none resize-none"
                  placeholder="Tell your story..."
                />
                <p className="text-xs text-right text-neutral-500 mt-1">{profileData.bio.length}/200</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Experience Level</label>
                <div className="flex gap-4">
                  {(["beginner", "intermediate", "professional"] as const).map(level => (
                    <label key={level} className={`flex-1 p-3 rounded-xl border cursor-pointer text-center capitalize transition-colors ${profileData.experienceLevel === level ? "border-bmki-purple bg-bmki-purple/5 text-bmki-purple dark:text-bmki-gold dark:border-bmki-gold" : "border-gray-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"}`}>
                      <input type="radio" className="hidden" checked={profileData.experienceLevel === level} onChange={() => setProfileData({...profileData, experienceLevel: level})} />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Skills / Tags</label>
                <input 
                  type="text" 
                  value={currentSkill}
                  onChange={e => setCurrentSkill(e.target.value)}
                  onKeyDown={addSkill}
                  placeholder="Type a skill and press Enter"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple dark:text-white outline-none mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm flex items-center gap-1 dark:text-neutral-300">
                      {skill}
                      <button onClick={() => setProfileData(prev => ({...prev, skills: prev.skills.filter((_, i) => i !== index)}))} className="hover:text-red-500 ml-1">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-neutral-800">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(profileData.socialLinks).map((platform) => (
                    <div key={platform} className="flex items-center gap-3">
                      <span className="w-20 capitalize text-sm text-neutral-500">{platform}</span>
                      <input 
                        type="text"
                        value={profileData.socialLinks[platform as keyof typeof profileData.socialLinks]}
                        onChange={e => setProfileData({
                          ...profileData, 
                          socialLinks: {...profileData.socialLinks, [platform]: e.target.value}
                        })}
                        placeholder={`@username`}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple dark:text-white outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
