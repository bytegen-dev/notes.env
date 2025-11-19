import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { AnimatedSection } from "../components/AnimatedSection";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { NoteCard } from "../components/NoteCard";
import { NoteEditor } from "../components/NoteEditor";
import { SectionHeader } from "../components/SectionHeader";
import { Sidebar } from "../components/Sidebar";
import { groupNotesByTime, NoteSection } from "../utils/groupNotes";
import { Note, storage } from "../utils/storage";
import { useTheme } from "../utils/useTheme";

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [sections, setSections] = useState<NoteSection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPinnedCollapsed, setIsPinnedCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { bgColor, cardBg, borderColor } = useTheme();

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    updateSections();
  }, [notes, searchQuery, isPinnedCollapsed]);

  const loadNotes = async () => {
    const loadedNotes = await storage.getNotes();
    setNotes(loadedNotes);
  };

  const updateSections = () => {
    let notesToGroup = notes;

    // Filter notes if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      notesToGroup = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    // Group notes by time periods
    const grouped = groupNotesByTime(notesToGroup);
    setSections(grouped);
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
    // Title is required
    if (!title.trim()) return;

    if (editingNote) {
      await storage.updateNote(editingNote.id, { title, content });
    } else {
      await storage.addNote({ title, content });
    }

    await loadNotes();
    closeEditor();
  };

  const togglePin = async (id: string) => {
    await storage.togglePin(id);
    await loadNotes();
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

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: bgColor }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1">
        <Header
          onAddPress={() => openEditor()}
          onSidebarPress={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {sections.length === 0 ? (
          <View className="flex-1 p-4 pt-40 justify-center items-center">
            <EmptyState />
          </View>
        ) : (
          <FlatList
            data={sections.flatMap((section) => [
              { type: "header", section },
              ...section.data.map((note) => ({ type: "item", note, section })),
            ])}
            renderItem={({ item }) => {
              if (item.type === "header") {
                return (
                  <SectionHeader
                    title={item.section.title}
                    isCollapsed={
                      item.section.title === "Pinned" && isPinnedCollapsed
                    }
                    onToggle={
                      item.section.title === "Pinned"
                        ? () => setIsPinnedCollapsed(!isPinnedCollapsed)
                        : undefined
                    }
                  />
                );
              }

              // Type guard for item type
              if (item.type !== "item") return null;

              // Type assertion after guard
              const itemNote = item as {
                type: "item";
                note: Note;
                section: NoteSection;
              };

              // Render items
              const section = itemNote.section;
              const sectionData = section.data;
              const isLastInSection =
                sectionData[sectionData.length - 1]?.id === itemNote.note.id;

              if (section.title === "Pinned") {
                // For Pinned section, wrap all items in AnimatedSection with container
                const pinnedSection = sections.find(
                  (s) => s.title === "Pinned"
                );
                const isFirstPinnedItem =
                  pinnedSection?.data[0]?.id === itemNote.note.id;

                if (isFirstPinnedItem) {
                  return (
                    <AnimatedSection isCollapsed={isPinnedCollapsed}>
                      <View
                        className="rounded-xl border overflow-hidden mb-3"
                        style={{
                          backgroundColor: cardBg,
                          borderColor,
                        }}
                      >
                        {pinnedSection?.data.map((note, index) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            onPress={openEditor}
                            onPin={togglePin}
                            onDelete={deleteNote}
                            isLast={index === pinnedSection.data.length - 1}
                          />
                        ))}
                      </View>
                    </AnimatedSection>
                  );
                }
                return null; // Other items are already rendered in the wrapper
              }

              // For other sections, check if it's the first item to wrap in container
              const isFirstInSection = sectionData[0]?.id === itemNote.note.id;
              if (isFirstInSection) {
                return (
                  <View
                    className="rounded-xl border overflow-hidden mb-3"
                    style={{
                      backgroundColor: cardBg,
                      borderColor,
                    }}
                  >
                    {sectionData.map((note, index) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onPress={openEditor}
                        onPin={togglePin}
                        onDelete={deleteNote}
                        isLast={index === sectionData.length - 1}
                      />
                    ))}
                  </View>
                );
              }
              return null; // Other items are already rendered in the wrapper
            }}
            keyExtractor={(item, index) => {
              if (item.type === "header") {
                return `header-${item.section.title}`;
              }
              if (item.type === "item") {
                return (
                  item as { type: "item"; note: Note; section: NoteSection }
                ).note.id;
              }
              return `item-${index}`;
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 16,
              paddingTop: 160,
            }}
            className="flex-1"
          />
        )}
      </View>

      <NoteEditor
        visible={isEditorOpen}
        note={editingNote}
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onClose={closeEditor}
        onSave={saveNote}
      />

      <Sidebar
        visible={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}
