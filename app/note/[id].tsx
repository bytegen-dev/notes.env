import { BlurView } from "expo-blur";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Edit, Pin, PinOff, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import { IconButton } from "../../components/IconButton";
import { NoteEditor } from "../../components/NoteEditor";
import { formatDate } from "../../utils/formatDate";
import { useLanguage } from "../../utils/i18n/LanguageContext";
import { Note, storage } from "../../utils/storage";
import { useTheme } from "../../utils/useTheme";

export default function NotePreview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();
  const { bgColor, textColor, mutedColor, isDark, cardBg, borderColor } =
    useTheme();
  const [note, setNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    loadNote();
  }, [id]);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const loadNote = async () => {
    if (!id) return;
    const notes = await storage.getNotes();
    const foundNote = notes.find((n) => n.id === id);
    setNote(foundNote || null);
  };

  const handleEdit = () => {
    setIsEditorOpen(true);
  };

  const handlePin = async () => {
    if (!note) return;
    await storage.togglePin(note.id);
    await loadNote();
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
          router.back();
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
    await storage.updateNote(note.id, { title, content });
    await loadNote();
    closeEditor();
  };

  if (!note) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: bgColor }}
      >
        <Text style={{ color: textColor }}>{t.noteCard.untitled}</Text>
      </View>
    );
  }

  const headerContent = (
    <View className="flex-row justify-between items-center">
      <IconButton onPress={() => router.back()} variant="outline">
        <ArrowLeft size={18} />
      </IconButton>
      <View style={{ flex: 1 }} />
      <View className="flex-row gap-2">
        <IconButton onPress={handlePin} variant="outline">
          {note.pinned ? <Pin size={18} /> : <PinOff size={18} />}
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
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex-1" style={{ backgroundColor: bgColor }}>
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
        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ paddingTop: 100 }}
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
          {note.content ? (
            <Text className="text-base leading-6" style={{ color: textColor }}>
              {note.content}
            </Text>
          ) : (
            <Text className="text-base italic" style={{ color: mutedColor }}>
              {t.noteEditor.contentPlaceholder}
            </Text>
          )}
        </ScrollView>
      </View>
      <NoteEditor
        visible={isEditorOpen}
        note={note}
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onClose={closeEditor}
        onSave={saveNote}
      />
    </>
  );
}
