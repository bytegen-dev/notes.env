import { useColorScheme } from "react-native";

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    isDark,
    bgColor: isDark ? "#000000" : "#ffffff",
    textColor: isDark ? "#ffffff" : "#000000",
    cardBg: isDark ? "#1a1a1a" : "#f5f5f5",
    borderColor: isDark ? "#333333" : "#e0e0e0",
    accentColor: isDark ? "#ffffff" : "#000000", // White in dark, black in light
    mutedColor: isDark ? "#666666" : "#999999",
    destructiveColor: "#ef4444",
  };
};

