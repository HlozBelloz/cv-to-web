export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string; // or "Present"
  current?: boolean;
  description: string;
  bulletPoints: string[];
}

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  startDate?: string;
  endDate?: string;
  honors?: string;
  gpa?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  role?: string;
  link?: string;
  technologies: string[];
  metrics?: string;
}

export interface SkillGroup {
  category: string; // e.g. "Leadership & Strategy", "Technical Core", "Tools & Frameworks"
  skills: string[];
}

export interface HighlightMetric {
  label: string;
  value: string;
  description?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  imageUrl?: string;
  credentialUrl?: string;
  badge?: string;
}

export interface PlatformAnalytics {
  totalVisitors: number;
  uniqueVisitors: number;
  totalCvWebsites: number;
  totalUsers: number;
  totalRevenueEgp: number;
  themeDistribution: Record<string, number>;
  topWebsites: Array<{ slug: string; name: string; views: number; theme: string }>;
}

export interface CVProfile {
  id: string;
  slug: string; // e.g. "mohamedcv" or "sarah-ahmed"
  fullName: string;
  title: string; // e.g. "Senior Engineering Manager"
  tagline: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  coverUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  summary: string;
  originalPdfUrl?: string;
  customDomain?: string; // e.g. "mohamed.com"
  customDomainStatus?: 'pending' | 'verified' | 'failed';
  theme: 'executive' | 'modern' | 'minimal' | 'tech' | 'creative';
  accentColor?: 'amber' | 'emerald' | 'blue' | 'indigo' | 'violet' | 'rose' | 'cyan' | 'slate';
  metrics: HighlightMetric[];
  experiences: Experience[];
  education: Education[];
  skillGroups: SkillGroup[];
  projects: Project[];
  certifications?: string[];
  certificates?: CertificateItem[];
  planId?: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  priceEgp: number;
  period: 'one-time' | 'monthly' | 'yearly';
  description: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  customDomainAllowed: boolean;
}

export interface PaymentTransaction {
  id: string;
  userEmail: string;
  planId: string;
  amountEgp: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'vodafone_cash' | 'instapay' | 'card' | 'test_mock';
  referenceCode?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  slug?: string;
  passwordHash?: string;
  googleId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface UserSession {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  slug?: string;
  name: string;
  avatarUrl?: string;
}

