import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';
import {
  UserProfile,
  Opportunity,
  Application,
  Bookmark,
  ApplicationStatus,
} from '../types';
import { INITIAL_OPPORTUNITIES, DEMO_STUDENT_PROFILE, DEMO_ADMIN_PROFILE } from './seedData';

// Local storage keys for persistent demo sandbox fallback
const LS_OPPORTUNITIES = 'opportunity_data_opps_v1';
const LS_APPLICATIONS = 'opportunity_data_apps_v1';
const LS_BOOKMARKS = 'opportunity_data_bookmarks_v1';
const LS_USER = 'opportunity_current_user_v1';
const LS_PROFILES = 'opportunity_user_profiles_v1';

// Helper for local mock storage
function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
}

// Initialize local demo storage if empty
export function initLocalStore(): void {
  if (!localStorage.getItem(LS_OPPORTUNITIES)) {
    setLocal(LS_OPPORTUNITIES, INITIAL_OPPORTUNITIES);
  }
  if (!localStorage.getItem(LS_APPLICATIONS)) {
    // Seed initial applications for the demo student to show rich dashboard
    const initialApps: Application[] = [
      {
        id: `${DEMO_STUDENT_PROFILE.id}_opp-google-aiml`,
        userId: DEMO_STUDENT_PROFILE.id,
        opportunityId: 'opp-google-aiml',
        status: 'Applied',
        appliedDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: `${DEMO_STUDENT_PROFILE.id}_opp-github-hackathon`,
        userId: DEMO_STUDENT_PROFILE.id,
        opportunityId: 'opp-github-hackathon',
        status: 'Shortlisted',
        appliedDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: `${DEMO_STUDENT_PROFILE.id}_opp-nvidia-workshop`,
        userId: DEMO_STUDENT_PROFILE.id,
        opportunityId: 'opp-nvidia-workshop',
        status: 'Interested',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: `${DEMO_STUDENT_PROFILE.id}_opp-aws-cert`,
        userId: DEMO_STUDENT_PROFILE.id,
        opportunityId: 'opp-aws-cert',
        status: 'Completed',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      }
    ];
    setLocal(LS_APPLICATIONS, initialApps);
  }
  if (!localStorage.getItem(LS_BOOKMARKS)) {
    const initialBookmarks: Bookmark[] = [
      {
        id: `${DEMO_STUDENT_PROFILE.id}_opp-google-aiml`,
        userId: DEMO_STUDENT_PROFILE.id,
        opportunityId: 'opp-google-aiml',
        createdAt: new Date().toISOString(),
      },
      {
        id: `${DEMO_STUDENT_PROFILE.id}_opp-meta-frontend`,
        userId: DEMO_STUDENT_PROFILE.id,
        opportunityId: 'opp-meta-frontend',
        createdAt: new Date().toISOString(),
      },
      {
        id: `${DEMO_STUDENT_PROFILE.id}_opp-openai-hackathon`,
        userId: DEMO_STUDENT_PROFILE.id,
        opportunityId: 'opp-openai-hackathon',
        createdAt: new Date().toISOString(),
      }
    ];
    setLocal(LS_BOOKMARKS, initialBookmarks);
  }
  if (!localStorage.getItem(LS_PROFILES)) {
    setLocal(LS_PROFILES, [DEMO_STUDENT_PROFILE, DEMO_ADMIN_PROFILE]);
  }
}

// Execute store initialization immediately
initLocalStore();

// ==========================================
// 1. AUTHENTICATION & USER PROFILE SERVICES
// ==========================================

export const authService = {
  async register(
    name: string,
    email: string,
    password: string,
    extra: Partial<UserProfile> = {}
  ): Promise<UserProfile> {
    if (isFirebaseConfigured && auth && db) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const profile: UserProfile = {
        id: user.uid,
        name,
        email,
        college: extra.college || 'University',
        course: extra.course || 'Computer Science',
        year: extra.year || '3rd Year',
        skills: extra.skills || ['JavaScript', 'React'],
        interests: extra.interests || ['Software Engineering'],
        preferredTypes: extra.preferredTypes || ['Internship'],
        preferredMode: extra.preferredMode || 'Hybrid',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'student',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return profile;
    } else {
      // Offline / Demo Sandbox Mode
      const newId = `user_${Date.now()}`;
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'student';
      const profile: UserProfile = {
        id: newId,
        name,
        email,
        college: extra.college || 'National University of Technology',
        course: extra.course || 'B.Tech Computer Science & AI',
        year: extra.year || '3rd Year',
        skills: extra.skills || ['Python', 'React', 'AI/ML'],
        interests: extra.interests || ['Artificial Intelligence', 'Full-Stack Development'],
        preferredTypes: extra.preferredTypes || ['Internship', 'Hackathon'],
        preferredMode: extra.preferredMode || 'Hybrid',
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const profiles = getLocal<UserProfile[]>(LS_PROFILES, []);
      profiles.push(profile);
      setLocal(LS_PROFILES, profiles);
      setLocal(LS_USER, profile);
      return profile;
    }
  },

  async login(email: string, password: string): Promise<UserProfile> {
    if (isFirebaseConfigured && auth && db) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      // Fallback profile if user doc not found
      return {
        id: userCredential.user.uid,
        name: userCredential.user.displayName || email.split('@')[0],
        email,
        college: 'University',
        course: 'Computer Science',
        year: '3rd Year',
        skills: ['React', 'JavaScript'],
        interests: ['Technology'],
        preferredTypes: ['Internship'],
        preferredMode: 'Hybrid',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'student',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Offline / Demo Sandbox Mode
      const profiles = getLocal<UserProfile[]>(LS_PROFILES, [DEMO_STUDENT_PROFILE, DEMO_ADMIN_PROFILE]);
      const matched = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

      if (matched) {
        setLocal(LS_USER, matched);
        return matched;
      }

      // Check if trying to log in as demo student or admin
      if (email.toLowerCase().includes('admin')) {
        setLocal(LS_USER, DEMO_ADMIN_PROFILE);
        return DEMO_ADMIN_PROFILE;
      }

      // Default demo student
      const student = {
        ...DEMO_STUDENT_PROFILE,
        email,
        name: email.split('@')[0].replace('.', ' '),
      };
      setLocal(LS_USER, student);
      return student;
    }
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(LS_USER);
  },

  async getCurrentProfile(): Promise<UserProfile | null> {
    if (isFirebaseConfigured && auth && db) {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } else {
      return getLocal<UserProfile | null>(LS_USER, null);
    }
  },

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    if (isFirebaseConfigured && db) {
      const ref = doc(db, 'users', userId);
      await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      const updated = await getDoc(ref);
      return updated.data() as UserProfile;
    } else {
      const profiles = getLocal<UserProfile[]>(LS_PROFILES, []);
      const index = profiles.findIndex(p => p.id === userId);
      let updatedUser: UserProfile;
      if (index !== -1) {
        profiles[index] = { ...profiles[index], ...data, updatedAt: new Date().toISOString() };
        updatedUser = profiles[index];
      } else {
        const current = getLocal<UserProfile>(LS_USER, DEMO_STUDENT_PROFILE);
        updatedUser = { ...current, ...data, updatedAt: new Date().toISOString() };
        profiles.push(updatedUser);
      }
      setLocal(LS_PROFILES, profiles);
      setLocal(LS_USER, updatedUser);
      return updatedUser;
    }
  },

  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    if (isFirebaseConfigured && auth && db) {
      return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (!firebaseUser) {
          callback(null);
          return;
        }
        try {
          if (!db) {
            callback(null);
            return;
          }
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) {
            callback(snap.data() as UserProfile);
          } else {
            callback({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Student',
              email: firebaseUser.email || '',
              college: 'University',
              course: 'Computer Science',
              year: '3rd Year',
              skills: ['React', 'JavaScript'],
              interests: ['Software Development'],
              preferredTypes: ['Internship'],
              preferredMode: 'Hybrid',
              role: 'student',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch {
          callback(null);
        }
      });
    } else {
      const localUser = getLocal<UserProfile | null>(LS_USER, null);
      callback(localUser);
      // Return unsubscription noop
      return () => {};
    }
  }
};

// ==========================================
// 2. OPPORTUNITY SERVICES
// ==========================================

export const opportunityService = {
  async getAllOpportunities(): Promise<Opportunity[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'opportunities'), orderBy('postedAt', 'desc'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Opportunity);
        }
      } catch (err) {
        console.warn('Firestore fetch failed or empty, falling back to local dataset', err);
      }
    }
    // Sandbox or fallback
    return getLocal<Opportunity[]>(LS_OPPORTUNITIES, INITIAL_OPPORTUNITIES);
  },

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'opportunities', id));
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as Opportunity;
        }
      } catch (e) {
        console.warn('Error fetching single opportunity from Firestore:', e);
      }
    }
    const all = getLocal<Opportunity[]>(LS_OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    return all.find(o => o.id === id) || null;
  },

  async createOpportunity(data: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Opportunity> {
    const newId = `opp_${Date.now()}`;
    const newOpp: Opportunity = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookmarkCount: 0,
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'opportunities', newId), {
        ...newOpp,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Always update local store too
    const all = getLocal<Opportunity[]>(LS_OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    all.unshift(newOpp);
    setLocal(LS_OPPORTUNITIES, all);
    return newOpp;
  },

  async updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<Opportunity> {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'opportunities', id), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    }

    const all = getLocal<Opportunity[]>(LS_OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const idx = all.findIndex(o => o.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
      setLocal(LS_OPPORTUNITIES, all);
      return all[idx];
    }
    throw new Error('Opportunity not found');
  },

  async deleteOpportunity(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'opportunities', id));
    }
    const all = getLocal<Opportunity[]>(LS_OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const filtered = all.filter(o => o.id !== id);
    setLocal(LS_OPPORTUNITIES, filtered);
  },

  async seedOpportunitiesToFirestore(): Promise<number> {
    if (!isFirebaseConfigured || !db) {
      // In local mode, just reset to INITIAL_OPPORTUNITIES
      setLocal(LS_OPPORTUNITIES, INITIAL_OPPORTUNITIES);
      return INITIAL_OPPORTUNITIES.length;
    }
    let seeded = 0;
    for (const opp of INITIAL_OPPORTUNITIES) {
      await setDoc(doc(db, 'opportunities', opp.id), {
        ...opp,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      seeded++;
    }
    return seeded;
  }
};

// ==========================================
// 3. APPLICATION SERVICES (KANBAN & TRACKER)
// ==========================================

export const applicationService = {
  async getUserApplications(userId: string): Promise<Application[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'applications'), where('userId', '==', userId));
        const snap = await getDocs(q);
        const apps = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Application);
        return apps;
      } catch (e) {
        console.warn('Error reading applications from Firestore:', e);
      }
    }
    const all = getLocal<Application[]>(LS_APPLICATIONS, []);
    return all.filter(a => a.userId === userId);
  },

  async setStatus(
    userId: string,
    opportunityId: string,
    status: ApplicationStatus,
    notes?: string
  ): Promise<Application> {
    const appId = `${userId}_${opportunityId}`;
    const now = new Date().toISOString();

    const application: Application = {
      id: appId,
      userId,
      opportunityId,
      status,
      notes: notes || '',
      appliedDate: status === 'Applied' ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'applications', appId), {
        ...application,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }

    const all = getLocal<Application[]>(LS_APPLICATIONS, []);
    const idx = all.findIndex(a => a.id === appId);
    if (idx !== -1) {
      all[idx] = { ...all[idx], status, notes: notes !== undefined ? notes : all[idx].notes, updatedAt: now };
      if (status === 'Applied' && !all[idx].appliedDate) {
        all[idx].appliedDate = now;
      }
      setLocal(LS_APPLICATIONS, all);
      return all[idx];
    } else {
      all.push(application);
      setLocal(LS_APPLICATIONS, all);
      return application;
    }
  },

  async deleteApplication(userId: string, opportunityId: string): Promise<void> {
    const appId = `${userId}_${opportunityId}`;
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'applications', appId));
    }
    const all = getLocal<Application[]>(LS_APPLICATIONS, []);
    setLocal(LS_APPLICATIONS, all.filter(a => a.id !== appId));
  }
};

// ==========================================
// 4. BOOKMARK SERVICES
// ==========================================

export const bookmarkService = {
  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'bookmarks'), where('userId', '==', userId));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }) as Bookmark);
      } catch (e) {
        console.warn('Error fetching bookmarks from Firestore:', e);
      }
    }
    const all = getLocal<Bookmark[]>(LS_BOOKMARKS, []);
    return all.filter(b => b.userId === userId);
  },

  async toggleBookmark(userId: string, opportunityId: string): Promise<boolean> {
    const bookmarkId = `${userId}_${opportunityId}`;
    const all = getLocal<Bookmark[]>(LS_BOOKMARKS, []);
    const existing = all.find(b => b.id === bookmarkId);

    if (existing) {
      // Remove
      if (isFirebaseConfigured && db) {
        await deleteDoc(doc(db, 'bookmarks', bookmarkId));
      }
      setLocal(LS_BOOKMARKS, all.filter(b => b.id !== bookmarkId));
      return false; // Not bookmarked anymore
    } else {
      // Add
      const newBm: Bookmark = {
        id: bookmarkId,
        userId,
        opportunityId,
        createdAt: new Date().toISOString(),
      };
      if (isFirebaseConfigured && db) {
        await setDoc(doc(db, 'bookmarks', bookmarkId), {
          ...newBm,
          createdAt: serverTimestamp(),
        });
      }
      all.push(newBm);
      setLocal(LS_BOOKMARKS, all);
      return true; // Bookmarked now
    }
  }
};
