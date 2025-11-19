import { Text, View } from "react-native";
import { useTheme } from "../utils/useTheme";

export const EmptyState = () => {
  const { mutedColor } = useTheme();

  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text
        style={{
          fontSize: 16,
          color: mutedColor,
          textAlign: "center",
        }}
      >
        No notes yet{"\n"}Tap + to create one
      </Text>
    </View>
  );
};

