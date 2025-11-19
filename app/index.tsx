import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { NoteCard } from "../components/NoteCard";
import { NoteEditor } from "../components/NoteEditor";
import { Note, storage } from "../utils/storage";
import { useTheme } from "../utils/useTheme";

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { bgColor } = useTheme();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const loadedNotes = await storage.getNotes();
    setNotes(
      loadedNotes.sort((a, b) => {
        // Pinned notes first (treat undefined as false)
        const aPinned = a.pinned ?? false;
        const bPinned = b.pinned ?? false;
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        // Then by updatedAt
        return b.updatedAt - a.updatedAt;
      })
    );
  };

  const openEditor = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setEditingNote(null);
      setTitle("");
      setContent("");
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  const saveNote = async () => {
    if (!title.trim() && !content.trim()) return;

    if (editingNote) {
      await storage.updateNote(editingNote.id, { title, content });
    } else {
      await storage.addNote({ title, content });
    }

    await loadNotes();
    closeEditor();
  };

  const deleteNote = async (id: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await storage.deleteNote(id);
            await loadNotes();
          },
        },
      ]
    );
  };

  const togglePin = async (id: string) => {
    await storage.togglePin(id);
    await loadNotes();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: bgColor }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, padding: 16, paddingTop: 60 }}>
        <Header onAddPress={() => openEditor()} />

        {notes.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={notes}
            renderItem={({ item }) => (
              <NoteCard
                note={item}
                onPress={openEditor}
                onPin={togglePin}
                onDelete={deleteNote}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <NoteEditor
        visible={isEditorOpen}
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onClose={closeEditor}
        onSave={saveNote}
      />
    </KeyboardAvoidingView>
  );
}
