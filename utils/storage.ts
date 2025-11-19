import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@notes_app_notes';
const HAS_SETUP_KEY = '@notes_app_has_setup';
const IS_LOCKED_KEY = '@notes_app_is_locked';
const PASSCODE_KEY = '@notes_app_passcode';
const BIOMETRIC_ENABLED_KEY = '@notes_app_biometric_enabled';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
}

export const storage = {
  async getNotes(): Promise<Note[]> {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  },

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  },

  async addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'pinned'>): Promise<Note> {
    const notes = await this.getNotes();
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pinned: false,
    };
    notes.push(newNote);
    await this.saveNotes(notes);
    return newNote;
  },

  async updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | null> {
    const notes = await this.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;
    
    notes[index] = {
      ...notes[index],
      ...updates,
      updatedAt: Date.now(),
    };
    await this.saveNotes(notes);
    return notes[index];
  },

  async deleteNote(id: string): Promise<boolean> {
    const notes = await this.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    await this.saveNotes(filtered);
    return filtered.length < notes.length;
  },

  async togglePin(id: string): Promise<Note | null> {
    const notes = await this.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;
    
    notes[index] = {
      ...notes[index],
      pinned: !(notes[index].pinned ?? false),
      updatedAt: Date.now(),
    };
    await this.saveNotes(notes);
    return notes[index];
  },

  async clearAllNotes(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NOTES_KEY);
    } catch (error) {
      console.error('Error clearing notes:', error);
    }
  },

  async hasSetup(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(HAS_SETUP_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking setup status:', error);
      return false;
    }
  },

  async setHasSetup(hasSetup: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(HAS_SETUP_KEY, hasSetup ? 'true' : 'false');
    } catch (error) {
      console.error('Error setting setup status:', error);
    }
  },

  async isLocked(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(IS_LOCKED_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking lock status:', error);
      return false;
    }
  },

  async setLocked(isLocked: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(IS_LOCKED_KEY, isLocked ? 'true' : 'false');
    } catch (error) {
      console.error('Error setting lock status:', error);
    }
  },

  async getPasscode(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(PASSCODE_KEY);
    } catch (error) {
      console.error('Error getting passcode:', error);
      return null;
    }
  },

  async setPasscode(passcode: string): Promise<void> {
    try {
      await AsyncStorage.setItem(PASSCODE_KEY, passcode);
    } catch (error) {
      console.error('Error setting passcode:', error);
    }
  },

  async hasPasscode(): Promise<boolean> {
    try {
      const passcode = await AsyncStorage.getItem(PASSCODE_KEY);
      return passcode !== null && passcode.length === 4;
    } catch (error) {
      console.error('Error checking passcode:', error);
      return false;
    }
  },

  async clearPasscode(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PASSCODE_KEY);
    } catch (error) {
      console.error('Error clearing passcode:', error);
    }
  },

  async isBiometricEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking biometric status:', error);
      return false;
    }
  },

  async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, enabled ? 'true' : 'false');
    } catch (error) {
      console.error('Error setting biometric status:', error);
    }
  },
};

