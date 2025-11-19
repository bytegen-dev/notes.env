import { BlurView } from "expo-blur";
import { Plus } from "lucide-react-native";
import { Platform, Text, View } from "react-native";
import { useTheme } from "../utils/useTheme";
import { IconButton } from "./IconButton";

interface HeaderProps {
  onAddPress: () => void;
}

export const Header = ({ onAddPress }: HeaderProps) => {
  const { textColor, isDark } = useTheme();

  const blurContent = (
    <View className="flex-row justify-between items-center">
      <Text className="text-3xl font-bold" style={{ color: textColor }}>
        Notes
      </Text>
      <IconButton onPress={onAddPress} variant="outline">
        <Plus size={24} strokeWidth={2.5} />
      </IconButton>
    </View>
  );

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={20}
        tint={isDark ? "dark" : "light"}
        className="absolute top-0 left-0 right-0 pt-[60px] pb-4 px-4 z-[1000] overflow-hidden"
      >
        {blurContent}
      </BlurView>
    );
  }

  // Fallback for Android - use semi-transparent background
  return (
    <View
      className="absolute top-0 left-0 right-0 pt-[60px] pb-4 px-4 z-[1000] overflow-hidden"
      style={{
        backgroundColor: isDark
          ? "rgba(0, 0, 0, 0.5)"
          : "rgba(255, 255, 255, 0.5)",
      }}
    >
      {blurContent}
    </View>
  );
};
