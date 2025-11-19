import { Stack } from "expo-router";
import { LanguageProvider } from "../utils/i18n/LanguageContext";
import "./globals.css";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </LanguageProvider>
  );
}
