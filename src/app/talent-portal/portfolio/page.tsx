"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db, storage } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import { Plus, X, Star, Trash2, Image as ImageIcon, Video as VideoIcon, Upload } from "lucide-react";
import type { PortfolioItem } from "@/types";

export default function PortfolioPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video" | "featured">("all");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFeatured, setUploadFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchItems = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "portfolio"), where("uid", "==", user.uid));
      const snap = await getDocs(q);
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioItem));
      // Sort by latest locally for now
      fetched.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setItems(fetched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) router.push("/talent-portal");
    else if (user) fetchItems();
  }, [user, authLoading, router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Size limits
      const isVideo = file.type.startsWith("video/");
      if (isVideo && file.size > 50 * 1024 * 1024) return alert("Video must be < 50MB");
      if (!isVideo && file.size > 10 * 1024 * 1024) return alert("Image must be < 10MB");

      setUploadFile(file);
      setUploadPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim() || !user) return;
    setUploading(true);
    
    try {
      const isVideo = uploadFile.type.startsWith("video/");
      const typeStr = isVideo ? "video" : "image";
      const storageRef = ref(storage, `portfolio/${user.uid}/${Date.now()}_${uploadFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, uploadFile);

      uploadTask.on("state_changed", 
        (snapshot) => {
          setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        },
        (error) => { throw error; }
      );

      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      await addDoc(collection(db, "portfolio"), {
        uid: user.uid,
        type: typeStr,
        url: downloadURL,
        title: uploadTitle.trim(),
        description: uploadDesc.trim(),
        isFeatured: uploadFeatured,
        createdAt: serverTimestamp(),
      });

      // Reset modal
      setIsModalOpen(false);
      setUploadFile(null);
      setUploadPreview("");
      setUploadTitle("");
      setUploadDesc("");
      setUploadFeatured(false);
      setUploadProgress(0);
      
      // Refresh items
      await fetchItems();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "portfolio", id), { isFeatured: !current });
      setItems(items.map(i => i.id === id ? { ...i, isFeatured: !current } : i));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      await deleteDoc(doc(db, "portfolio", id));
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(i => {
    if (filter === "all") return true;
    if (filter === "featured") return i.isFeatured;
    return i.type === filter;
  });

  const featuredItems = items.filter(i => i.isFeatured);

  if (authLoading || loading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-bmki-purple border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold dark:text-white">My Portfolio</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Showcase your best work to the world.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-bmki-purple text-white font-bold rounded-xl hover:bg-bmki-purple/90 transition-colors shadow-lg flex items-center gap-2"
          >
            <Plus size={20} /> Upload New
          </button>
        </div>

        {/* Featured Strip */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
            <Star className="text-bmki-gold fill-bmki-gold" size={24} /> Featured Work
          </h2>
          {featuredItems.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Mark your best work as featured to highlight it here.</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {featuredItems.map(item => (
                <div key={item.id} className="min-w-[280px] w-[280px] h-[200px] rounded-2xl overflow-hidden relative group shrink-0 snap-start border border-neutral-200 dark:border-neutral-800">
                  {item.type === "image" ? (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <h3 className="text-white font-semibold truncate">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(["all", "image", "video", "featured"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full font-medium capitalize whitespace-nowrap transition-colors ${
                filter === f 
                  ? "bg-bmki-purple text-white dark:bg-bmki-gold dark:text-bmki-purple" 
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-bmki-purple"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-3xl">
            <p>No items found for this filter.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredItems.map(item => (
              <div key={item.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all">
                {item.type === "image" ? (
                  <img src={item.url} alt={item.title} className="w-full object-cover" />
                ) : (
                  <video src={item.url} className="w-full object-cover" controls={false} muted preload="metadata" />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded text-xs text-white uppercase flex items-center gap-1">
                      {item.type === "image" ? <ImageIcon size={12} /> : <VideoIcon size={12} />}
                      {item.type}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleFeatured(item.id, item.isFeatured)}
                        className={`p-2 rounded-full backdrop-blur-md transition-colors ${item.isFeatured ? "bg-bmki-gold text-white" : "bg-black/50 text-white hover:bg-bmki-gold"}`}
                        title={item.isFeatured ? "Remove featured" : "Mark as featured"}
                      >
                        <Star size={16} className={item.isFeatured ? "fill-white" : ""} />
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="p-2 rounded-full bg-red-500/80 backdrop-blur-md text-white hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                    {item.description && <p className="text-gray-300 text-sm mt-1 line-clamp-2">{item.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => !uploading && setIsModalOpen(false)}
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
              >
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                  <h2 className="text-2xl font-bold dark:text-white">Upload Media</h2>
                  <button onClick={() => !uploading && setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* File Selector */}
                  {!uploadFile ? (
                    <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <Upload className="w-10 h-10 text-neutral-400 mb-2" />
                      <p className="text-neutral-600 dark:text-neutral-400 font-medium">Click to select video or image</p>
                      <p className="text-xs text-neutral-500 mt-2">Max 50MB video, 10MB image</p>
                      <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
                    </label>
                  ) : (
                    <div className="relative h-48 bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                      {uploadFile.type.startsWith("image/") ? (
                        <img src={uploadPreview} className="max-h-full max-w-full object-contain" alt="Preview" />
                      ) : (
                        <video src={uploadPreview} className="max-h-full max-w-full" controls />
                      )}
                      {!uploading && (
                        <button onClick={() => { setUploadFile(null); setUploadPreview(""); }} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500">
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Title *</label>
                    <input 
                      type="text" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} disabled={uploading}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description (Optional)</label>
                    <textarea 
                      value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} disabled={uploading} rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-bmki-purple dark:text-white outline-none resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" checked={uploadFeatured} onChange={e => setUploadFeatured(e.target.checked)} disabled={uploading}
                      className="w-5 h-5 rounded border-gray-300 text-bmki-purple focus:ring-bmki-purple"
                    />
                    <span className="text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                      <Star size={16} className="text-bmki-gold" /> Mark as Featured Work
                    </span>
                  </label>

                  {/* Progress Bar */}
                  {uploading && (
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-bmki-purple h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}

                  <button 
                    onClick={handleUpload}
                    disabled={!uploadFile || !uploadTitle.trim() || uploading}
                    className="w-full py-4 bg-bmki-purple text-white font-bold rounded-xl hover:bg-bmki-purple/90 transition-colors disabled:opacity-50 mt-4"
                  >
                    {uploading ? `Uploading... ${uploadProgress}%` : "Upload to Portfolio"}
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
