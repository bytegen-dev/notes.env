import { Check, Lock } from "lucide-react-native";
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
  isSelected?: boolean;
}

export const NoteCard = ({
  note,
  onPress,
  onPin,
  onDelete,
  isLast = false,
  isSelected = false,
}: NoteCardProps) => {
  const { t } = useLanguage();
  const { cardBg, textColor, mutedColor, borderColor, accentColor } =
    useTheme();

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
          backgroundColor: isSelected
            ? accentColor === "#ffffff"
              ? "rgba(0, 0, 0, 0.1)"
              : "rgba(255, 255, 255, 0.1)"
            : cardBg,
        }}
      >
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1">
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
                {formatDate(note.updatedAt)}
                {note.encrypted ? "" : ` - ${note.content}`}
              </Text>
            ) : (
              note.encrypted && (
                <Text
                  className="text-sm"
                  style={{ color: mutedColor }}
                  numberOfLines={1}
                >
                  {formatDate(note.updatedAt)}
                </Text>
              )
            )}
          </View>
          <View className="flex-row items-center gap-2">
            {note.encrypted && (
              <Lock size={16} color={mutedColor} strokeWidth={2} />
            )}
            {isSelected && (
              <View
                className="w-6 h-6 rounded-full items-center justify-center"
                style={{
                  backgroundColor: textColor,
                }}
              >
                <Check size={16} color={cardBg} strokeWidth={3} />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
