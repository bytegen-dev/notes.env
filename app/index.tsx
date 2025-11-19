import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Plus } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedSection } from "../components/AnimatedSection";
import { CreatePasscodeScreen } from "../components/CreatePasscodeScreen";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { LockScreen } from "../components/LockScreen";
import { NoteCard } from "../components/NoteCard";
import { NoteEditor } from "../components/NoteEditor";
import { SectionHeader } from "../components/SectionHeader";
import { SettingsModal } from "../components/SettingsModal";
import { SplashScreen } from "../components/SplashScreen";
import { groupNotesByTime, NoteSection } from "../utils/groupNotes";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { Note, storage } from "../utils/storage";
import { useTheme } from "../utils/useTheme";

export default function Index() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [sections, setSections] = useState<NoteSection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPinnedCollapsed, setIsPinnedCollapsed] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const [showCreatePasscode, setShowCreatePasscode] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isCheckingLock, setIsCheckingLock] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { t, language } = useLanguage();
  const { bgColor, cardBg, borderColor, accentColor } = useTheme();

  useEffect(() => {
    checkSetup();
  }, []);

  useEffect(() => {
    if (!showSplash) {
      loadNotes();
      // Animate in the main content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [showSplash]);

  const checkSetup = async () => {
    const hasSetup = await storage.hasSetup();
    setShowSplash(!hasSetup);
    setIsCheckingSetup(false);
    // If already set up, check passcode and lock status
    if (hasSetup) {
      const hasPasscode = await storage.hasPasscode();
      if (!hasPasscode) {
        // No passcode set, show create passcode screen
        setShowCreatePasscode(true);
      } else {
        // Has passcode, check lock status
        const locked = await storage.isLocked();
        setIsLocked(locked);
        setIsCheckingLock(false);
        if (!locked) {
          fadeAnim.setValue(1);
          loadNotes();
        }
      }
    } else {
      setIsCheckingLock(false);
    }
  };

  const checkLockStatus = async () => {
    const locked = await storage.isLocked();
    setIsLocked(locked);
    setIsCheckingLock(false);
  };

  const toggleLock = async () => {
    const newLockStatus = !isLocked;
    await storage.setLocked(newLockStatus);
    setIsLocked(newLockStatus);
    // If locking, reset fade animation for lock screen
    if (newLockStatus) {
      fadeAnim.setValue(1);
    }
  };

  const handleUnlock = async () => {
    await storage.setLocked(false);
    setIsLocked(false);
    // Reset fade animation for smooth transition
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    // Reload notes if needed
    if (!showSplash) {
      await loadNotes();
    }
  };

  useEffect(() => {
    updateSections();
  }, [notes, searchQuery, isPinnedCollapsed, language]);

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
    const grouped = groupNotesByTime(notesToGroup, t);
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
    // Delay state reset to allow modal animation to complete
    setTimeout(() => {
      setEditingNote(null);
      setTitle("");
      setContent("");
    }, 300);
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
    Alert.alert(t.alerts.deleteNoteTitle, t.alerts.deleteNoteMessage, [
      {
        text: t.alerts.cancel,
        style: "cancel",
      },
      {
        text: t.alerts.delete,
        style: "destructive",
        onPress: async () => {
          await storage.deleteNote(id);
          await loadNotes();
        },
      },
    ]);
  };

  const exportNotes = async () => {
    try {
      const allNotes = await storage.getNotes();
      const jsonData = JSON.stringify(allNotes, null, 2);
      const fileName = `notes-export-${Date.now()}.json`;
      const file = new File(Paths.cache, fileName);

      await file.write(jsonData);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/json",
          dialogTitle: t.settings.exportNotes,
        });
      } else {
        Alert.alert(t.settings.exportNotes, t.alerts.sharingNotAvailable);
      }
    } catch (error) {
      console.error("Error exporting notes:", error);
      Alert.alert(t.alerts.error, t.alerts.exportFailed);
    }
  };

  const importNotes = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets[0].uri;
      const file = new File(fileUri);
      const jsonString = await file.text();
      const importedData = JSON.parse(jsonString);

      // Validate that it's an array
      if (!Array.isArray(importedData)) {
        Alert.alert(t.alerts.error, t.alerts.invalidFileFormat);
        return;
      }

      // Validate and normalize each note
      const validNotes = importedData
        .filter(
          (note: any) =>
            note &&
            typeof note === "object" &&
            typeof note.title === "string" &&
            typeof note.content === "string"
        )
        .map((note: any) => ({
          ...note,
          id:
            note.id ||
            Date.now().toString() + Math.random().toString(36).substring(2, 11),
          createdAt: note.createdAt || Date.now(),
          updatedAt: note.updatedAt || Date.now(),
          pinned: note.pinned ?? false,
        }));

      if (validNotes.length === 0) {
        Alert.alert(t.alerts.error, t.alerts.noValidNotes);
        return;
      }

      // Check if there are existing notes
      const existingNotes = await storage.getNotes();

      // If no existing notes, import directly
      if (existingNotes.length === 0) {
        await storage.saveNotes(validNotes);
        await loadNotes();
        Alert.alert(t.alerts.success, t.alerts.imported(validNotes.length));
        return;
      }

      // Ask user if they want to replace or merge
      Alert.alert(
        t.alerts.importNotesTitle,
        t.alerts.importNotesMessage(validNotes.length),
        [
          {
            text: t.alerts.cancel,
            style: "cancel",
          },
          {
            text: t.alerts.replace,
            style: "destructive",
            onPress: async () => {
              await storage.saveNotes(validNotes);
              await loadNotes();
              Alert.alert(
                t.alerts.success,
                t.alerts.imported(validNotes.length)
              );
            },
          },
          {
            text: t.alerts.merge,
            onPress: async () => {
              const currentNotes = await storage.getNotes();
              const existingIds = new Set(currentNotes.map((n) => n.id));

              // Overwrite existing notes or add new ones
              const mergedNotes = [...currentNotes];
              let updatedCount = 0;
              let addedCount = 0;

              validNotes.forEach((importedNote) => {
                if (existingIds.has(importedNote.id)) {
                  // Overwrite existing note
                  const index = mergedNotes.findIndex(
                    (n) => n.id === importedNote.id
                  );
                  if (index !== -1) {
                    mergedNotes[index] = importedNote;
                    updatedCount++;
                  }
                } else {
                  // Add new note
                  mergedNotes.push(importedNote);
                  addedCount++;
                }
              });

              await storage.saveNotes(mergedNotes);
              await loadNotes();

              const message =
                updatedCount > 0 && addedCount > 0
                  ? t.alerts.updatedAndAdded(updatedCount, addedCount)
                  : updatedCount > 0
                  ? t.alerts.updated(updatedCount)
                  : t.alerts.added(addedCount);

              Alert.alert(t.alerts.success, message);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error importing notes:", error);
      Alert.alert(t.alerts.error, t.alerts.importFailed);
    }
  };

  const clearAllData = async () => {
    await storage.clearAllNotes();
    await storage.setHasSetup(false);
    await storage.clearPasscode();
    await loadNotes();
    setIsSettingsOpen(false);
    setShowSplash(true);
  };

  const handleGetStarted = async () => {
    await storage.setHasSetup(true);
    setShowSplash(false);
    // After splash, check if passcode needs to be created
    const hasPasscode = await storage.hasPasscode();
    if (!hasPasscode) {
      setShowCreatePasscode(true);
    }
  };

  const handlePasscodeCreated = async (passcode: string) => {
    await storage.setPasscode(passcode);
    setShowCreatePasscode(false);
    // Animate in the main content
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    await loadNotes();
  };

  // Show splash screen while checking setup or if setup not completed
  if (isCheckingSetup || showSplash) {
    return (
      <View className="flex-1" style={{ backgroundColor: bgColor }}>
        <SplashScreen onGetStarted={handleGetStarted} />
      </View>
    );
  }

  // Show create passcode screen if passcode needs to be created
  if (showCreatePasscode) {
    return (
      <View className="flex-1" style={{ backgroundColor: bgColor }}>
        <CreatePasscodeScreen onComplete={handlePasscodeCreated} />
      </View>
    );
  }

  // Show lock screen if locked
  if (isCheckingLock || isLocked) {
    return (
      <View className="flex-1" style={{ backgroundColor: bgColor }}>
        <LockScreen onUnlock={handleUnlock} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: bgColor }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View
        className="flex-1"
        style={{
          opacity: fadeAnim,
        }}
      >
        <Header
          onAddPress={() => openEditor()}
          onSettingsPress={() => setIsSettingsOpen(true)}
          onLockPress={toggleLock}
          isLocked={isLocked}
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
                      item.section.title === t.sections.pinned &&
                      isPinnedCollapsed
                    }
                    onToggle={
                      item.section.title === t.sections.pinned
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

              if (section.title === t.sections.pinned) {
                // For Pinned section, wrap all items in AnimatedSection with container
                const pinnedSection = sections.find(
                  (s) => s.title === t.sections.pinned
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
      </Animated.View>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => openEditor()}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center"
        style={{
          backgroundColor: accentColor,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Plus
          size={24}
          color={accentColor === "#ffffff" ? "#000000" : "#ffffff"}
          strokeWidth={2.5}
        />
      </TouchableOpacity>

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

      <SettingsModal
        visible={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onClearData={clearAllData}
        onExport={exportNotes}
        onImport={importNotes}
      />
    </KeyboardAvoidingView>
  );
}
