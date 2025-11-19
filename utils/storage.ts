import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@notes_app_notes';
const HAS_SETUP_KEY = '@notes_app_has_setup';

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
};

