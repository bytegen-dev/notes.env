import { Text, View } from "react-native";
import { useTheme } from "../utils/useTheme";

export const EmptyState = () => {
  const { mutedColor } = useTheme();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-base text-center" style={{ color: mutedColor }}>
        まだ被害者はいません。{"\n"}「+」をタップして被害者を作成してください。
      </Text>
    </View>
  );
};
