import { Pin, PinOff, Trash2 } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { Note } from "../utils/storage";
import { formatDate } from "../utils/formatDate";
import { useTheme } from "../utils/useTheme";

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NoteCard = ({ note, onPress, onPin, onDelete }: NoteCardProps) => {
  const { isDark, cardBg, textColor, borderColor, accentColor, mutedColor } = useTheme();

  return (
    <View
      style={{
        backgroundColor: cardBg,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <TouchableOpacity
            onPress={() => onPin(note.id)}
            style={{ padding: 4, marginRight: 8 }}
          >
            {note.pinned ?? false ? (
              <Pin size={18} color={accentColor} fill={accentColor} />
            ) : (
              <PinOff size={18} color={mutedColor} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPress(note)} style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: textColor,
              }}
              numberOfLines={1}
            >
              {note.title || "Untitled"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => onDelete(note.id)}
          style={{ padding: 4 }}
        >
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => onPress(note)}>
        {note.content ? (
          <Text
            style={{
              fontSize: 14,
              color: mutedColor,
              marginBottom: 8,
            }}
            numberOfLines={3}
          >
            {note.content}
          </Text>
        ) : null}

        <Text
          style={{
            fontSize: 12,
            color: mutedColor,
          }}
        >
          {formatDate(note.updatedAt)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

