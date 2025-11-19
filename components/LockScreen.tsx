import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { storage } from "../utils/storage";
import { Dialog } from "./Dialog";
import { PasscodeInput } from "./PasscodeInput";

interface LockScreenProps {
  onUnlock: () => void;
  onReset?: () => void;
}

const splashImages = [
  require("../assets/images/splash.gif"),
  require("../assets/images/splash-2.gif"),
  require("../assets/images/splash-3.gif"),
];

export const LockScreen = ({ onUnlock, onReset }: LockScreenProps) => {
  const { t } = useLanguage();
  const [splashIndex, setSplashIndex] = useState(0);
  const [passcode, setPasscode] = useState("");
  const [showForgotPasscodeModal, setShowForgotPasscodeModal] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const textColor = "#ffffff";
  const bgColor = "#000000";

  useEffect(() => {
    checkBiometricStatus();
  }, []);

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
        onUnlock();
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

  const handleSplashClick = () => {
    setSplashIndex((prev) => (prev + 1) % splashImages.length);
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
            onUnlock();
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
      // No passcode stored, something went wrong
      Alert.alert(
        t.lockScreen.locked,
        "No passcode found. Please set up a passcode."
      );
      return false;
    }

    const storedPasscodeTrimmed = storedPasscode.trim();
    return storedPasscodeTrimmed === codeToCheck;
  };

  const handleForgotPasscode = () => {
    setShowForgotPasscodeModal(true);
  };

  const handleResetApp = () => {
    setShowForgotPasscodeModal(false);
    Alert.alert(t.lockScreen.resetApp, t.lockScreen.resetConfirmMessage, [
      {
        text: t.alerts.cancel,
        style: "cancel",
      },
      {
        text: t.lockScreen.resetApp,
        style: "destructive",
        onPress: () => {
          onReset?.();
        },
      },
    ]);
  };

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleSplashClick}
        className="flex-1"
      >
        <ImageBackground
          source={splashImages[splashIndex]}
          resizeMode="cover"
          className="flex-1"
          style={{ backgroundColor: bgColor }}
        >
          <View
            className="flex-1 absolute top-0 left-0 right-0 bottom-0"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          />

          <View className="pt-40 items-center">
            <Text
              className="text-4xl font-mono font-bold tracking-tighter"
              style={{ color: textColor }}
            >
              {t.lockScreen.locked}_
            </Text>
          </View>

          <View className="flex-1" />

          <View className="pb-12 px-12 gap-6">
            <View className="items-center gap-4">
              <Text
                className="text-base font-mono"
                style={{ color: textColor, opacity: 0.8 }}
              >
                {t.lockScreen.enterPasscode}
              </Text>
              <View className="flex-row gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <View
                    key={index}
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      borderColor: textColor,
                      backgroundColor:
                        index < passcode.length ? textColor : "transparent",
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
            <Pressable onPress={handleForgotPasscode} className="mt-4">
              <Text
                className="text-sm font-mono text-center"
                style={{ color: textColor, opacity: 0.7 }}
              >
                {t.lockScreen.forgotPasscode}
              </Text>
            </Pressable>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* Forgot Passcode Modal */}
      <Modal
        visible={showForgotPasscodeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForgotPasscodeModal(false)}
      >
        <Dialog
          visible={showForgotPasscodeModal}
          title={t.lockScreen.forgotPasscodeTitle}
          message={t.lockScreen.forgotPasscodeMessage}
          onClose={() => setShowForgotPasscodeModal(false)}
          onConfirm={handleResetApp}
          confirmText={t.lockScreen.resetApp}
          cancelText={t.alerts.cancel}
          confirmStyle="destructive"
        />
      </Modal>
    </View>
  );
};
