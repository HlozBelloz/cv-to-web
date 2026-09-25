import { CVProfile, Plan, PaymentTransaction, User } from '@/types';
import { DEFAULT_PLANS, DEMO_PROFILES } from './default-data';
import { hashPassword, isPasswordHashed } from './security';
import fs from 'fs';
import path from 'path';

// Local storage cache file path for server persistence when running in dev/demo mode
const DATA_FILE = path.join(process.cwd(), '.data-store.json');

export const DEFAULT_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'admin@cvplatform.com',
    name: 'Platform Administrator',
    role: 'admin',
    // Strong PBKDF2 hash with unique cryptographic salt (password: 'admin123')
    passwordHash: 'pbkdf2:sha512:100000:855a93300b42c9366c09f7a67fe8fa72:2b8f5e79e680153f9d333760e96420ad351c474d36969a67ee85b55f54ced576f13a3573c289e9de96a9aa4df737a74174d3e202570fcca3e47f4e0442caa522',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-mazen',
    email: 'mazeneltelbany78@gmail.com',
    name: 'Mazen Mohamed Hamdy',
    role: 'user',
    slug: 'mazen',
    // Strong PBKDF2 hash with unique cryptographic salt (password: 'mazen123')
    passwordHash: 'pbkdf2:sha512:100000:a5b0b711ee727f6e33f1f6b90e1f98e0:8d5d233c7ed7e42fa39b983b5a74ee1916a3fb8b5aac858013e0c6a950283067e9039bfb34c353bfa8b6f7eb34a2522beaef2bb8ed818adc6d572d5cbd897ae6',
    createdAt: new Date().toISOString(),
  }
];

interface DatabaseStore {
  profiles: CVProfile[];
  plans: Plan[];
  payments: PaymentTransaction[];
  users: User[];
}

function loadLocalStore(): DatabaseStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const rawUsers: User[] = parsed.users || DEFAULT_USERS;
      let upgraded = false;

      // Migrate any legacy plain-text passwords to strong salted PBKDF2 hashes
      const users: User[] = rawUsers.map((u) => {
        if (u.passwordHash && !isPasswordHashed(u.passwordHash)) {
          upgraded = true;
          return {
            ...u,
            passwordHash: hashPassword(u.passwordHash),
          };
        }
        return u;
      });

      const store: DatabaseStore = {
        profiles: parsed.profiles || DEMO_PROFILES,
        plans: parsed.plans || DEFAULT_PLANS,
        payments: parsed.payments || [],
        users,
      };

      if (upgraded) {
        saveLocalStore(store);
      }

      return store;
    }
  } catch (err) {
    console.warn('Could not read local data store, initializing defaults:', err);
  }
  return {
    profiles: [...DEMO_PROFILES],
    plans: [...DEFAULT_PLANS],
    payments: [],
    users: [...DEFAULT_USERS],
  };
}

function saveLocalStore(store: DatabaseStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local data store:', err);
  }
}

const memoryStore: DatabaseStore = loadLocalStore();

export const dataStore = {
  // --- Profiles ---
  async getProfiles(): Promise<CVProfile[]> {
    return memoryStore.profiles;
  },

  async getProfileBySlug(slug: string): Promise<CVProfile | null> {
    const profile = memoryStore.profiles.find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase()
    );
    return profile || null;
  },

  async getProfileByCustomDomain(domain: string): Promise<CVProfile | null> {
    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    const profile = memoryStore.profiles.find(
      (p) => p.customDomain && p.customDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '') === cleanDomain
    );
    return profile || null;
  },

  async saveProfile(profile: CVProfile): Promise<CVProfile> {
    const existingIndex = memoryStore.profiles.findIndex((p) => p.id === profile.id || p.slug === profile.slug);
    if (existingIndex >= 0) {
      memoryStore.profiles[existingIndex] = { ...profile, updatedAt: new Date().toISOString() };
    } else {
      memoryStore.profiles.unshift({
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    saveLocalStore(memoryStore);
    return profile;
  },

  async incrementViewCount(slug: string): Promise<void> {
    const profile = memoryStore.profiles.find((p) => p.slug === slug);
    if (profile) {
      profile.viewCount = (profile.viewCount || 0) + 1;
      saveLocalStore(memoryStore);
    }
  },

  async deleteProfile(id: string): Promise<boolean> {
    const initialLen = memoryStore.profiles.length;
    memoryStore.profiles = memoryStore.profiles.filter((p) => p.id !== id);
    if (memoryStore.profiles.length !== initialLen) {
      saveLocalStore(memoryStore);
      return true;
    }
    return false;
  },

  // --- Plans & Pricing ---
  async getPlans(): Promise<Plan[]> {
    return memoryStore.plans;
  },

  async getPlanById(id: string): Promise<Plan | null> {
    return memoryStore.plans.find((p) => p.id === id) || null;
  },

  async updatePlanPrice(id: string, newPriceEgp: number): Promise<Plan | null> {
    const plan = memoryStore.plans.find((p) => p.id === id);
    if (plan) {
      plan.priceEgp = newPriceEgp;
      saveLocalStore(memoryStore);
      return plan;
    }
    return null;
  },

  async savePlan(plan: Plan): Promise<Plan> {
    const index = memoryStore.plans.findIndex((p) => p.id === plan.id);
    if (index >= 0) {
      memoryStore.plans[index] = plan;
    } else {
      memoryStore.plans.push(plan);
    }
    saveLocalStore(memoryStore);
    return plan;
  },

  // --- Payments ---
  async recordPayment(payment: PaymentTransaction): Promise<PaymentTransaction> {
    memoryStore.payments.unshift(payment);
    saveLocalStore(memoryStore);
    return payment;
  },

  async getPayments(): Promise<PaymentTransaction[]> {
    return memoryStore.payments;
  },

  // --- Users & Authentication ---
  async getUserByEmail(email: string): Promise<User | null> {
    const user = memoryStore.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    return user || null;
  },

  async getUserById(id: string): Promise<User | null> {
    return memoryStore.users.find((u) => u.id === id) || null;
  },

  async saveUser(user: User): Promise<User> {
    const existingIndex = memoryStore.users.findIndex((u) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      memoryStore.users[existingIndex] = user;
    } else {
      memoryStore.users.push(user);
    }
    saveLocalStore(memoryStore);
    return user;
  },

  async getUsers(): Promise<User[]> {
    return memoryStore.users;
  }
};

