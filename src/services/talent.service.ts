import { db, storage } from "@/lib/firebase";
import { 
  collection, doc, getDoc, getDocs, updateDoc, query, where, 
  addDoc, serverTimestamp, deleteDoc 
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import type { TalentProfile, PortfolioItem, Application } from "@/types";

export const TalentService = {
  // Profiles
  getProfile: async (uid: string): Promise<TalentProfile | null> => {
    const snap = await getDoc(doc(db, "talents", uid));
    return snap.exists() ? (snap.data() as TalentProfile) : null;
  },

  updateProfile: async (uid: string, data: Partial<TalentProfile>) => {
    await updateDoc(doc(db, "talents", uid), data);
  },

  // Portfolio
  getPortfolioItems: async (uid: string): Promise<PortfolioItem[]> => {
    const q = query(collection(db, "portfolio"), where("uid", "==", uid));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioItem));
    return items.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  },

  uploadPortfolioMedia: async (uid: string, file: File, onProgress?: (p: number) => void): Promise<string> => {
    const storageRef = ref(storage, `portfolio/${uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on("state_changed", 
        (snap) => {
          if (onProgress) {
            onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
          }
        },
        reject,
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  },

  addPortfolioItem: async (item: Omit<PortfolioItem, "id" | "createdAt">) => {
    return await addDoc(collection(db, "portfolio"), {
      ...item,
      createdAt: serverTimestamp(),
    });
  },

  deletePortfolioItem: async (id: string) => {
    await deleteDoc(doc(db, "portfolio", id));
  },

  toggleFeaturedPortfolio: async (id: string, isFeatured: boolean) => {
    await updateDoc(doc(db, "portfolio", id), { isFeatured });
  },

  // Applications
  getApplications: async (uid: string): Promise<Application[]> => {
    const q = query(collection(db, "applications"), where("uid", "==", uid));
    const snap = await getDocs(q);
    const apps = snap.docs.map(d => ({ id: d.id, ...d.data() } as Application));
    return apps.sort((a, b) => (b.submittedAt?.toMillis?.() || 0) - (a.submittedAt?.toMillis?.() || 0));
  },

  applyForAudition: async (application: Omit<Application, "id" | "submittedAt" | "status">) => {
    return await addDoc(collection(db, "applications"), {
      ...application,
      status: "pending",
      submittedAt: serverTimestamp(),
    });
  }
};
