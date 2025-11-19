import { Alert, Text, TouchableOpacity, View } from "react-native";
import { formatDate } from "../utils/formatDate";
import { useLanguage } from "../utils/i18n/LanguageContext";
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
  const { t } = useLanguage();
  const { cardBg, textColor, mutedColor, borderColor } = useTheme();

  const handleLongPress = () => {
    if (!onPin && !onDelete) return;

    Alert.alert(note.title || t.noteCard.untitled, undefined, [
      ...(onPin
        ? [
            {
              text: note.pinned ? t.noteCard.unpin : t.noteCard.pin,
              onPress: () => onPin(note.id),
            },
          ]
        : []),
      ...(onDelete
        ? [
            {
              text: t.noteCard.delete,
              style: "destructive" as const,
              onPress: () => onDelete(note.id),
            },
          ]
        : []),
      {
        text: t.alerts.cancel,
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
          {note.title || t.noteCard.untitled}
        </Text>
        {note.content ? (
          <Text
            className="text-sm"
            style={{ color: mutedColor }}
            numberOfLines={1}
          >
            {formatDate(note.updatedAt)} - {note.content}
          </Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};
