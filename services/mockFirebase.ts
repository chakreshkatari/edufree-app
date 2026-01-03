import { User, Note, Summary } from '../types';

// Simulating a backend service
const STORAGE_KEY_USER = 'edufree_user';
const STORAGE_KEY_SUMMARIES = 'edufree_summaries';
const STORAGE_KEY_NOTES = 'edufree_notes';

export const mockAuth = {
  currentUser: null as User | null,
  
  signIn: async (): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const user: User = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      displayName: 'Alex Student',
      email: 'alex@university.edu',
      photoURL: 'https://picsum.photos/100/100' // Placeholder avatar
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  },

  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    return stored ? JSON.parse(stored) : null;
  }
};

export const mockDb = {
  saveSummary: async (summary: Summary) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const current = mockDb.getSummaries();
    const updated = [summary, ...current];
    localStorage.setItem(STORAGE_KEY_SUMMARIES, JSON.stringify(updated));
  },

  getSummaries: (): Summary[] => {
    const stored = localStorage.getItem(STORAGE_KEY_SUMMARIES);
    return stored ? JSON.parse(stored) : [];
  },

  saveNote: async (note: Note) => {
     // In a real app this would patch, here we just upsert based on ID
     const current = mockDb.getNotes();
     const existingIndex = current.findIndex(n => n.id === note.id);
     let updated;
     if (existingIndex >= 0) {
        updated = [...current];
        updated[existingIndex] = note;
     } else {
        updated = [note, ...current];
     }
     localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updated));
  },

  getNotes: (): Note[] => {
    const stored = localStorage.getItem(STORAGE_KEY_NOTES);
    return stored ? JSON.parse(stored) : [];
  }
};