import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Note } from "../utils/storage";
import { useTheme } from "../utils/useTheme";

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
  onPin?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLast?: boolean;
}

export const NoteCard = ({
  note,
  onPress,
  onPin,
  onDelete,
  isLast = false,
}: NoteCardProps) => {
  const { cardBg, textColor, mutedColor, borderColor } = useTheme();

  const handleLongPress = () => {
    if (!onPin && !onDelete) return;

    Alert.alert(note.title || "Untitled", undefined, [
      ...(onPin
        ? [
            {
              text: note.pinned ? "Unpin" : "Pin",
              onPress: () => onPin(note.id),
            },
          ]
        : []),
      ...(onDelete
        ? [
            {
              text: "Delete",
              style: "destructive" as const,
              onPress: () => onDelete(note.id),
            },
          ]
        : []),
      {
        text: "Cancel",
        style: "cancel" as const,
      },
    ]);
  };

  return (
    <View
      style={{
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: borderColor,
      }}
    >
      <TouchableOpacity
        onPress={() => onPress(note)}
        onLongPress={handleLongPress}
        className="p-4"
        style={{
          backgroundColor: cardBg,
        }}
      >
        <Text
          className="text-base font-semibold mb-1"
          style={{ color: textColor }}
          numberOfLines={1}
        >
          {note.title || "Untitled"}
        </Text>
        {note.content ? (
          <Text
            className="text-sm"
            style={{ color: mutedColor }}
            numberOfLines={1}
          >
            {note.content}
          </Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};
