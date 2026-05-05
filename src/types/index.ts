export interface TalentProfile {
  uid: string;
  email: string;
  fullName: string;
  talentType: string;
  bio?: string;
  profilePhotoURL?: string;
  skills?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
  experienceLevel?: "beginner" | "intermediate" | "professional";
  profileComplete: number; // 0–100
  isVerified?: boolean;
  badges?: string[];
  createdAt: any;
}

export interface PortfolioItem {
  id: string;
  uid: string;
  type: "image" | "video";
  url: string;
  thumbnailURL?: string;
  title: string;
  description?: string;
  isFeatured: boolean;
  createdAt: any;
}

export interface Audition {
  id: string;
  title: string;
  description: string;
  deadline: string;
  talentTypes: string[];
  slots: number;
  status: "open" | "closed";
}

export interface Application {
  id: string;
  uid: string;
  auditionId: string;
  auditionTitle: string;
  status: "pending" | "shortlisted" | "selected" | "rejected";
  submittedAt: any;
  notes?: string;
}

export interface Notification {
  id: string;
  uid: string;
  message: string;
  read: boolean;
  type: "info" | "success" | "warning";
  createdAt: any;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: any;
}
