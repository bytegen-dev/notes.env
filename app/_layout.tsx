import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { LanguageProvider } from "../utils/i18n/LanguageContext";
import "./globals.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === "dark" ? "#000000" : "#ffffff";

  return (
    <LanguageProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#000000",
          },
          // contentStyle: {
          //   backgroundColor: bgColor,
          // },
        }}
      />
    </LanguageProvider>
  );
}
