import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { Alert, Modal, Platform, Pressable, Text, View } from "react-native";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { storage } from "../utils/storage";
import { PasscodeInput } from "./PasscodeInput";

interface LockModalProps {
  visible: boolean;
  onUnlock: (passcode: string) => void;
  onClose?: () => void;
}

export const LockModal = ({ visible, onUnlock, onClose }: LockModalProps) => {
  const { t } = useLanguage();
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="rounded-2xl p-6"
          style={{
            backgroundColor: "#000000",
            width: "85%",
            maxWidth: 400,
          }}
        >
          <View className="items-center gap-4 mb-6">
            <Text
              className="text-xl font-mono font-semibold"
              style={{ color: "#ffffff" }}
            >
              {t.lockScreen.locked}
            </Text>
            <Text
              className="text-base font-mono"
              style={{ color: "#ffffff", opacity: 0.8 }}
            >
              {t.lockScreen.enterPasscode}
            </Text>
            <View className="flex-row gap-3">
              {[0, 1, 2, 3].map((index) => (
                <View
                  key={index}
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    borderColor: "#ffffff",
                    backgroundColor:
                      index < passcode.length ? "#ffffff" : "transparent",
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
        </Pressable>
      </Pressable>
    </Modal>
  );
};
