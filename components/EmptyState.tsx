import { Text, View } from "react-native";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { useTheme } from "../utils/useTheme";

export const EmptyState = () => {
  const { t } = useLanguage();
  const { mutedColor } = useTheme();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-base text-center" style={{ color: mutedColor }}>
        {t.emptyState.noNotes}
      </Text>
    </View>
  );
};
