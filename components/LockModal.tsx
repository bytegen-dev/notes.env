import { BlurView } from "expo-blur";
import * as LocalAuthentication from "expo-local-authentication";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Modal, Platform, ScrollView, Text, View } from "react-native";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { storage } from "../utils/storage";
import { useTheme } from "../utils/useTheme";
import { IconButton } from "./IconButton";
import { PasscodeInput } from "./PasscodeInput";

interface LockModalProps {
  visible: boolean;
  onUnlock: (passcode: string) => void;
  onClose?: () => void;
}

export const LockModal = ({ visible, onUnlock, onClose }: LockModalProps) => {
  const { t } = useLanguage();
  const { isDark, textColor, mutedColor } = useTheme();
  const [passcode, setPasscode] = useState("");
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    if (visible) {
      checkBiometricStatus();
      setPasscode("");
    }
  }, [visible]);

  const checkBiometricStatus = async () => {
    const isEnabled = await storage.isBiometricEnabled();
    setBiometricEnabled(isEnabled);
  };

  const handleBiometricPress = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:
          Platform.OS === "ios"
            ? t.lockScreen.faceIdUnlock
            : t.lockScreen.fingerprintUnlock,
        cancelLabel: t.alerts.cancel,
        disableDeviceFallback: false,
      });

      if (result.success) {
        const storedPasscode = await storage.getPasscode();
        if (storedPasscode) {
          onUnlock(storedPasscode);
        }
      } else if (result.error === "user_cancel") {
        // User cancelled, do nothing
      } else {
        Alert.alert(
          t.lockScreen.locked,
          Platform.OS === "ios"
            ? t.lockScreen.faceIdNotEnabled
            : t.lockScreen.fingerprintNotEnabled
        );
      }
    } catch (error) {
      Alert.alert(
        t.lockScreen.locked,
        Platform.OS === "ios"
          ? t.lockScreen.faceIdNotEnabled
          : t.lockScreen.fingerprintNotEnabled
      );
    }
  };

  const handleDigitPress = async (digit: string) => {
    if (passcode.length < 4) {
      const newPasscode = passcode + digit;
      setPasscode(newPasscode);

      // If 4 digits entered, validate and unlock
      if (newPasscode.length === 4) {
        // Small delay to show the 4th digit
        setTimeout(async () => {
          const isValid = await validatePasscode(newPasscode);
          if (isValid) {
            setPasscode("");
            onUnlock(newPasscode);
          } else {
            // Invalid passcode, show error and reset
            Alert.alert(t.lockScreen.locked, t.lockScreen.incorrectPasscode);
            setPasscode("");
          }
        }, 100);
      }
    }
  };

  const handleDelete = () => {
    if (passcode.length > 0) {
      setPasscode(passcode.slice(0, -1));
    }
  };

  const validatePasscode = async (code: string): Promise<boolean> => {
    const codeToCheck = code.trim();
    if (codeToCheck.length !== 4) {
      return false;
    }

    const storedPasscode = await storage.getPasscode();
    if (!storedPasscode) {
      Alert.alert(
        t.lockScreen.locked,
        "No passcode found. Please set up a passcode."
      );
      return false;
    }

    const storedPasscodeTrimmed = storedPasscode.trim();
    return storedPasscodeTrimmed === codeToCheck;
  };

  const modalBg = isDark ? "#0a0a0a" : "#fafafa";
  const passcodeIndicatorColor = isDark ? "#ffffff" : "#000000";

  const headerContent = (
    <View className="flex-row justify-between items-center">
      {onClose && (
        <IconButton onPress={onClose} variant="outline">
          <X size={18} />
        </IconButton>
      )}
      <Text
        className="text-lg font-mono font-semibold"
        style={{ color: textColor }}
      >
        {t.lockScreen.locked}
      </Text>
      <View style={{ width: 40 }} />

      {!onClose && <View style={{ width: 40 }} />}
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
          contentContainerStyle={{
            paddingTop: 100,
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <View className="items-center gap-4 mb-6">
            <Text className="text-base font-mono" style={{ color: mutedColor }}>
              {t.lockScreen.enterPasscode}
            </Text>
            <View className="flex-row gap-3">
              {[0, 1, 2, 3].map((index) => (
                <View
                  key={index}
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    borderColor: passcodeIndicatorColor,
                    backgroundColor:
                      index < passcode.length
                        ? passcodeIndicatorColor
                        : "transparent",
                  }}
                />
              ))}
            </View>
          </View>
          <PasscodeInput
            passcode={passcode}
            onDigitPress={handleDigitPress}
            onDelete={handleDelete}
            onBiometricPress={handleBiometricPress}
            biometricEnabled={biometricEnabled}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};
