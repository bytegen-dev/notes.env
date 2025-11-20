import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ArrowLeft, Edit, Pin, PinOff, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { decryptContent, encryptContent } from "../utils/encryption";
import { formatDate } from "../utils/formatDate";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { Note, storage } from "../utils/storage";
import { useTheme } from "../utils/useTheme";
import { IconButton } from "./IconButton";
import { LockModal } from "./LockModal";
import { NoteEditor } from "./NoteEditor";

interface NotePreviewContentProps {
  noteId: string | null;
  onNoteUpdate?: () => void;
  onNoteDelete?: () => void;
  isSplitView?: boolean;
}

export const NotePreviewContent = ({
  noteId,
  onNoteUpdate,
  onNoteDelete,
  isSplitView = false,
}: NotePreviewContentProps) => {
  const router = useRouter();
  const { t } = useLanguage();
  const { bgColor, textColor, mutedColor, isDark, cardBg, borderColor } =
    useTheme();
  const [note, setNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [showLockModal, setShowLockModal] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [encrypted, setEncrypted] = useState(false);

  useEffect(() => {
    loadNote();
  }, [noteId]);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setEncrypted(note.encrypted || false);
      // Reset decryption state when note changes
      if (note.encrypted) {
        setDecryptedContent(null);
        setIsDecrypted(false);
        setShowLockModal(true);
      } else {
        setDecryptedContent(note.content);
        setIsDecrypted(true);
        setShowLockModal(false);
      }
    }
  }, [note]);

  const loadNote = async () => {
    if (!noteId) {
      setNote(null);
      setDecryptedContent(null);
      setIsDecrypted(false);
      return;
    }
    const notes = await storage.getNotes();
    const foundNote = notes.find((n) => n.id === noteId);
    setNote(foundNote || null);
  };

  const handleUnlock = async (passcode: string) => {
    if (!note || !note.encrypted) return;

    try {
      const decrypted = decryptContent(note.content, passcode);
      setDecryptedContent(decrypted);
      setIsDecrypted(true);
      setShowLockModal(false);
    } catch (error) {
      Alert.alert(
        t.lockScreen.locked,
        error instanceof Error ? error.message : "Failed to decrypt note"
      );
    }
  };

  const handleEdit = () => {
    // If note is encrypted and not decrypted, show lock modal first
    if (note?.encrypted && !isDecrypted) {
      setShowLockModal(true);
      return;
    }
    setIsEditorOpen(true);
  };

  const handlePin = async () => {
    if (!note) return;
    await storage.togglePin(note.id);
    await loadNote();
    onNoteUpdate?.();
  };

  const handleDelete = () => {
    if (!note) return;
    Alert.alert(t.alerts.deleteNoteTitle, t.alerts.deleteNoteMessage, [
      {
        text: t.alerts.cancel,
        style: "cancel",
      },
      {
        text: t.alerts.delete,
        style: "destructive",
        onPress: async () => {
          await storage.deleteNote(note.id);
          setNote(null);
          onNoteDelete?.();
        },
      },
    ]);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setTimeout(() => {
      setTitle(note?.title || "");
      setContent(note?.content || "");
    }, 300);
  };

  const saveNote = async () => {
    if (!note || !title.trim()) return;

    // Get passcode for encryption
    const passcode = await storage.getPasscode();
    if (!passcode && encrypted) {
      Alert.alert(
        "Error",
        "Passcode is required to encrypt notes. Please set up a passcode first."
      );
      return;
    }

    // Encrypt content if needed
    let finalContent = decryptedContent || content;
    if (encrypted && passcode) {
      try {
        finalContent = encryptContent(finalContent, passcode);
      } catch (error) {
        Alert.alert("Error", "Failed to encrypt note content.");
        return;
      }
    }

    await storage.updateNote(note.id, {
      title,
      content: finalContent,
      encrypted,
    });
    await loadNote();
    closeEditor();
    onNoteUpdate?.();
  };

  if (!noteId || !note) {
    return (
      <View
        className="flex-1 justify-center items-center px-4"
        style={{ backgroundColor: bgColor }}
      >
        <Text className="text-base text-center" style={{ color: mutedColor }}>
          {isSplitView ? t.emptyState.selectNote : t.noteCard.untitled}
        </Text>
      </View>
    );
  }

  const headerContent = (
    <View className="flex-row justify-between items-center">
      {!isSplitView && (
        <IconButton onPress={() => router.back()} variant="outline">
          <ArrowLeft size={18} />
        </IconButton>
      )}
      {isSplitView && <View style={{ flex: 1 }} />}
      <View className="flex-row gap-2">
        <IconButton
          onPress={handlePin}
          variant={note.pinned ? "filled" : "outline"}
        >
          {note.pinned ? <PinOff size={18} /> : <Pin size={18} />}
        </IconButton>
        <IconButton onPress={handleEdit} variant="outline">
          <Edit size={18} />
        </IconButton>
        <IconButton onPress={handleDelete} variant="outline">
          <Trash2 size={18} />
        </IconButton>
      </View>
    </View>
  );

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: bgColor }}>
        {!isSplitView && (
          <>
            {Platform.OS === "ios" ? (
              <BlurView
                intensity={20}
                tint={isDark ? "dark" : "light"}
                className="absolute top-0 left-0 right-0 pt-[60px] pb-4 px-4 z-[1000] overflow-hidden"
              >
                {headerContent}
              </BlurView>
            ) : (
              <View
                className="absolute top-0 left-0 right-0 pt-[60px] pb-4 px-4 z-[1000] overflow-hidden"
                style={{
                  backgroundColor: isDark
                    ? "rgba(0, 0, 0, 0.5)"
                    : "rgba(255, 255, 255, 0.5)",
                }}
              >
                {headerContent}
              </View>
            )}
          </>
        )}
        {isSplitView && (
          <View
            className="pb-4 px-4"
            style={{
              paddingTop: Platform.OS === "ios" ? 60 : 16,
            }}
          >
            {headerContent}
          </View>
        )}
        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ paddingTop: isSplitView ? 0 : 100 }}
        >
          <View className="items-center mb-2">
            <Text className="text-sm" style={{ color: mutedColor }}>
              {formatDate(note.updatedAt)}
            </Text>
          </View>
          <Text
            className="text-xl font-semibold mb-2"
            style={{ color: textColor }}
          >
            {note.title || t.noteCard.untitled}
          </Text>
          {note.encrypted && !isDecrypted ? (
            <View className="items-center justify-center py-8">
              <Text className="text-base" style={{ color: mutedColor }}>
                {t.lockScreen.enterPasscode}
              </Text>
            </View>
          ) : decryptedContent || note.content ? (
            <Text className="text-base leading-6" style={{ color: textColor }}>
              {decryptedContent || note.content}
            </Text>
          ) : (
            <Text className="text-base italic" style={{ color: mutedColor }}>
              {t.noteEditor.contentPlaceholder}
            </Text>
          )}
        </ScrollView>
      </View>
      <LockModal
        visible={showLockModal}
        onUnlock={handleUnlock}
        onClose={() => {
          if (!isDecrypted && note?.encrypted) {
            // If user closes without decrypting, go back or clear selection
            if (!isSplitView) {
              router.back();
            } else {
              // In split view, just close the modal but keep note selected
              setShowLockModal(false);
            }
          } else {
            setShowLockModal(false);
          }
        }}
      />
      <NoteEditor
        visible={isEditorOpen}
        note={note}
        title={title}
        content={decryptedContent || content}
        onTitleChange={setTitle}
        onContentChange={(newContent) => {
          setContent(newContent);
          if (isDecrypted) {
            setDecryptedContent(newContent);
          }
        }}
        onClose={closeEditor}
        onSave={saveNote}
        encrypted={encrypted}
        onEncryptedChange={setEncrypted}
      />
    </>
  );
};
