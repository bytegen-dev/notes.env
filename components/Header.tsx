import { Plus } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../utils/useTheme";

interface HeaderProps {
  onAddPress: () => void;
}

export const Header = ({ onAddPress }: HeaderProps) => {
  const { textColor, accentColor, bgColor } = useTheme();
  // Icon color should be opposite of accent (if accent is white, icon is black, etc)
  const iconColor = accentColor === "#ffffff" ? "#000000" : "#ffffff";

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "700", color: textColor }}>
        Notes
      </Text>
      <TouchableOpacity
        onPress={onAddPress}
        style={{
          backgroundColor: accentColor,
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: accentColor === "#ffffff" ? 1 : 0,
          borderColor: "#e0e0e0",
        }}
      >
        <Plus size={24} color={iconColor} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

