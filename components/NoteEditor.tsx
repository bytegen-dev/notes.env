import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../utils/useTheme";

interface NoteEditorProps {
  visible: boolean;
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const NoteEditor = ({
  visible,
  title,
  content,
  onTitleChange,
  onContentChange,
  onClose,
  onSave,
}: NoteEditorProps) => {
  const { bgColor, textColor, borderColor, accentColor, mutedColor } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: bgColor, paddingTop: 60 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 16, color: accentColor }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "600", color: textColor }}>
            Note
          </Text>
          <TouchableOpacity onPress={onSave}>
            <Text
              style={{ fontSize: 16, fontWeight: "600", color: accentColor }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }}>
          <TextInput
            placeholder="Title"
            placeholderTextColor={mutedColor}
            value={title}
            onChangeText={onTitleChange}
            style={{
              fontSize: 24,
              fontWeight: "600",
              color: textColor,
              marginBottom: 16,
              padding: 0,
            }}
            autoFocus
          />
          <TextInput
            placeholder="Start writing..."
            placeholderTextColor={mutedColor}
            value={content}
            onChangeText={onContentChange}
            multiline
            style={{
              fontSize: 16,
              color: textColor,
              minHeight: 200,
              padding: 0,
            }}
            textAlignVertical="top"
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

