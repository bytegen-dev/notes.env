import { ChevronDown } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { useTheme } from "../utils/useTheme";

interface SectionHeaderProps {
  title: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const SectionHeader = ({
  title,
  isCollapsed = false,
  onToggle,
}: SectionHeaderProps) => {
  const { t } = useLanguage();
  const { textColor, accentColor } = useTheme();
  const isPinned = title === t.sections.pinned;

  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-xl font-semibold" style={{ color: textColor }}>
        {title}
      </Text>
      {isPinned && (
        <TouchableOpacity
          onPress={onToggle}
          disabled={!onToggle}
          className="p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View
            style={{
              transform: [{ rotate: isCollapsed ? "-90deg" : "0deg" }],
            }}
          >
            <ChevronDown size={20} color={accentColor} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};
