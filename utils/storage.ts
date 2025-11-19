import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@notes_app_notes';

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
};

