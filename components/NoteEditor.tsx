import { BlurView } from "expo-blur";
import { Check, X } from "lucide-react-native";
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Note } from "../utils/storage";
import { useTheme } from "../utils/useTheme";
import { IconButton } from "./IconButton";

interface NoteEditorProps {
  visible: boolean;
  note: Note | null;
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const NoteEditor = ({
  visible,
  note,
  title,
  content,
  onTitleChange,
  onContentChange,
  onClose,
  onSave,
}: NoteEditorProps) => {
  const { textColor, mutedColor, isDark, accentColor } = useTheme();

  // Use a muted background for the modal
  const modalBg = isDark ? "#0a0a0a" : "#fafafa";

  // Check if it's a new note
  const isNewNote = !note;

  // Check if there are changes
  const hasChanges = isNewNote
    ? title.trim().length > 0 || content.trim().length > 0
    : title !== (note?.title || "") || content !== (note?.content || "");

  // Check if title is required (for new notes, title is required; for editing, title must exist if there are changes)
  const hasTitle = title.trim().length > 0;

  // Disable save if no title or no changes
  const canSave = hasTitle && hasChanges;

  // Determine header text
  const headerText = isNewNote ? "New note" : "Edit note";

  const headerContent = (
    <View className="flex-row justify-between items-center">
      <IconButton onPress={onClose} variant="outline">
        <X size={24} strokeWidth={2.5} />
      </IconButton>
      <Text className="text-lg font-semibold" style={{ color: textColor }}>
        {headerText}
      </Text>
      <IconButton
        onPress={canSave ? onSave : undefined}
        variant="outline"
        style={{
          opacity: canSave ? 1 : 0.4,
        }}
      >
        <Check size={24} strokeWidth={2.5} />
      </IconButton>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: modalBg }}>
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={20}
            tint={isDark ? "dark" : "light"}
            className="absolute top-0 left-0 right-0 pt-4 pb-4 px-4 z-[1000] border-b"
            style={{ borderBottomColor: "rgba(128, 128, 128, 0.2)" }}
          >
            {headerContent}
          </BlurView>
        ) : (
          <View
            className="absolute top-0 left-0 right-0 pt-4 pb-4 px-4 z-[1000] border-b"
            style={{
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(255, 255, 255, 0.5)",
              borderBottomColor: "rgba(128, 128, 128, 0.2)",
            }}
          >
            {headerContent}
          </View>
        )}

        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ paddingTop: 70 }}
        >
          <TextInput
            placeholder="Title"
            placeholderTextColor={mutedColor}
            value={title}
            onChangeText={onTitleChange}
            className="text-2xl font-semibold mb-4 p-0"
            style={{ color: textColor }}
            autoFocus
          />
          <TextInput
            placeholder="Start writing..."
            placeholderTextColor={mutedColor}
            value={content}
            onChangeText={onContentChange}
            multiline
            className="text-base min-h-[200px] p-0"
            style={{ color: textColor }}
            textAlignVertical="top"
          />
        </ScrollView>
      </View>
    </Modal>
  );
};
