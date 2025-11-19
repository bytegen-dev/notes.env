import { BlurView } from "expo-blur";
import * as LocalAuthentication from "expo-local-authentication";
import { Check, ChevronDown, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { storage } from "../utils/storage";
import { useTheme } from "../utils/useTheme";
import { Dialog } from "./Dialog";
import { IconButton } from "./IconButton";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onClearData: () => void;
  onExport: () => void;
  onImport: () => void;
  hasNotes?: boolean;
}

const languages = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
];

export const SettingsModal = ({
  visible,
  onClose,
  onClearData,
  onExport,
  onImport,
  hasNotes = true,
}: SettingsModalProps) => {
  const { t, language, setLanguage } = useLanguage();
  const {
    textColor,
    mutedColor,
    isDark,
    cardBg,
    bgColor,
    borderColor,
    destructiveColor,
  } = useTheme();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    const [isAvailable, isEnabled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      storage.isBiometricEnabled(),
    ]);
    setBiometricAvailable(isAvailable);
    setBiometricEnabled(isEnabled);
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      // Check if biometrics are available
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert(t.settings.biometric, t.settings.biometricNotAvailable);
        return;
      }

      // Check if biometrics are enrolled
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert(
          t.settings.biometric,
          Platform.OS === "ios"
            ? "Face ID is not set up on this device. Please set it up in Settings."
            : "Fingerprint is not set up on this device. Please set it up in Settings."
        );
        return;
      }

      // Test authentication before enabling
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:
          Platform.OS === "ios"
            ? "Authenticate to enable Face ID"
            : "Authenticate to enable Fingerprint",
        cancelLabel: t.alerts.cancel,
      });

      if (result.success) {
        await storage.setBiometricEnabled(true);
        setBiometricEnabled(true);
      }
    } else {
      await storage.setBiometricEnabled(false);
      setBiometricEnabled(false);
    }
  };

  // Use a muted background for the modal
  const modalBg = isDark ? "#0a0a0a" : "#fafafa";

  const handleClearData = () => {
    Alert.alert(t.alerts.clearDataTitle, t.alerts.clearDataMessage, [
      {
        text: t.alerts.cancel,
        style: "cancel",
      },
      {
        text: t.alerts.clearData,
        style: "destructive",
        onPress: onClearData,
      },
    ]);
  };

  const handleLanguageSelect = (langCode: "en" | "ja") => {
    setLanguage(langCode);
    setShowLanguagePicker(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === language);

  const headerContent = (
    <View className="flex-row justify-between items-center">
      <IconButton onPress={onClose} variant="outline">
        <X size={24} strokeWidth={2.5} />
      </IconButton>
      <Text className="text-lg font-semibold" style={{ color: textColor }}>
        {t.settings.title}
      </Text>
      <View className="w-11" />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: modalBg }}>
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={20}
            tint={isDark ? "dark" : "light"}
            className="absolute top-0 left-0 right-0 pt-4 pb-4 px-4 z-[1000] border-b"
            style={{ borderBottomColor: "rgba(128, 128, 128, 0.2)" }}
          >
            {headerContent}
          </BlurView>
        ) : (
          <View
            className="absolute top-0 left-0 right-0 pt-4 pb-4 px-4 z-[1000] border-b"
            style={{
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(255, 255, 255, 0.5)",
              borderBottomColor: "rgba(128, 128, 128, 0.2)",
            }}
          >
            {headerContent}
          </View>
        )}

        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ paddingTop: 70 }}
        >
          <TouchableOpacity
            onPress={() => setShowLanguagePicker(true)}
            className="p-4 rounded-xl border mb-3"
            style={{
              backgroundColor: cardBg,
              borderColor: borderColor,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text
                  className="text-base font-semibold"
                  style={{ color: textColor }}
                >
                  {t.settings.language}
                </Text>
                <Text className="text-sm mt-1" style={{ color: mutedColor }}>
                  {t.settings.languageDesc}
                </Text>
                <Text className="text-base mt-2" style={{ color: textColor }}>
                  {currentLanguage?.name}
                </Text>
              </View>
              <ChevronDown size={20} color={mutedColor} />
            </View>
          </TouchableOpacity>
          {biometricAvailable && (
            <View
              className="p-4 rounded-xl border mb-3"
              style={{
                backgroundColor: cardBg,
                borderColor: borderColor,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text
                    className="text-base font-semibold"
                    style={{ color: textColor }}
                  >
                    {t.settings.biometric}
                  </Text>
                  <Text className="text-sm mt-1" style={{ color: mutedColor }}>
                    {t.settings.biometricDesc}
                  </Text>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={handleBiometricToggle}
                  trackColor={{
                    false: mutedColor,
                    true: Platform.OS === "ios" ? "#34C759" : "#4CAF50",
                  }}
                  thumbColor={Platform.OS === "ios" ? "#ffffff" : "#ffffff"}
                />
              </View>
            </View>
          )}
          <TouchableOpacity
            onPress={onImport}
            className="p-4 rounded-xl border mb-3"
            style={{
              backgroundColor: cardBg,
              borderColor: borderColor,
            }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: textColor }}
            >
              {t.settings.importNotes}
            </Text>
            <Text className="text-sm mt-1" style={{ color: mutedColor }}>
              {t.settings.importNotesDesc}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={hasNotes ? onExport : undefined}
            disabled={!hasNotes}
            className="p-4 rounded-xl border mb-3"
            style={{
              backgroundColor: cardBg,
              borderColor: borderColor,
              opacity: hasNotes ? 1 : 0.5,
            }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: textColor }}
            >
              {t.settings.exportNotes}
            </Text>
            <Text className="text-sm mt-1" style={{ color: mutedColor }}>
              {t.settings.exportNotesDesc}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleClearData}
            className="p-4 rounded-xl border mb-3"
            style={{
              backgroundColor: destructiveColor,
              borderColor: destructiveColor,
            }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: "#ffffff" }}
            >
              {t.settings.clearData}
            </Text>
            <Text
              className="text-sm mt-1"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              {t.settings.clearDataDesc}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Language Picker Modal */}
      <Modal
        visible={showLanguagePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguagePicker(false)}
      >
        <Dialog
          visible={showLanguagePicker}
          title={t.settings.language}
          onClose={() => setShowLanguagePicker(false)}
        >
          <ScrollView className="w-full">
            {languages.map((lang, index) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleLanguageSelect(lang.code as "en" | "ja")}
                className="p-4"
                style={{
                  borderBottomWidth: index < languages.length - 1 ? 1 : 0,
                  borderBottomColor: borderColor,
                }}
              >
                <View className="flex-row items-center justify-between w-full gap-4">
                  <Text
                    className="text-base"
                    style={{
                      color: textColor,
                      fontWeight: language === lang.code ? "600" : "400",
                    }}
                  >
                    {lang.name}
                  </Text>
                  {language === lang.code && (
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
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Dialog>
      </Modal>
    </Modal>
  );
};
