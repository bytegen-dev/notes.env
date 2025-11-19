import { useState } from "react";
import {
  Alert,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { useTheme } from "../utils/useTheme";
import { PasscodeInput } from "./PasscodeInput";

interface CreatePasscodeScreenProps {
  onComplete: (passcode: string) => void;
}

const splashImages = [
  require("../assets/images/splash.gif"),
  require("../assets/images/splash-2.gif"),
  require("../assets/images/splash-3.gif"),
];

export const CreatePasscodeScreen = ({
  onComplete,
}: CreatePasscodeScreenProps) => {
  const { t } = useLanguage();
  const theme = useTheme();
  const [splashIndex, setSplashIndex] = useState(0);
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const textColor = "#ffffff";
  const bgColor = "#000000";
  const isDark = theme.isDark;

  const handleSplashClick = () => {
    setSplashIndex((prev) => (prev + 1) % splashImages.length);
  };

  const handleDigitPress = (digit: string) => {
    if (!isConfirming) {
      if (passcode.length < 4) {
        const newPasscode = passcode + digit;
        setPasscode(newPasscode);

        // If 4 digits entered, move to confirmation
        if (newPasscode.length === 4) {
          setIsConfirming(true);
        }
      }
    } else {
      if (confirmPasscode.length < 4) {
        const newConfirmPasscode = confirmPasscode + digit;
        setConfirmPasscode(newConfirmPasscode);

        // If 4 digits entered, check if they match
        if (newConfirmPasscode.length === 4) {
          handleConfirm(newConfirmPasscode);
        }
      }
    }
  };

  const handleDelete = () => {
    if (!isConfirming) {
      if (passcode.length > 0) {
        setPasscode(passcode.slice(0, -1));
      }
    } else {
      if (confirmPasscode.length > 0) {
        setConfirmPasscode(confirmPasscode.slice(0, -1));
      }
    }
  };

  const handleConfirm = (code?: string) => {
    const codeToCheck = code || confirmPasscode;
    if (codeToCheck.length === 4) {
      if (codeToCheck === passcode) {
        // Passcodes match, save and complete
        onComplete(passcode);
      } else {
        // Passcodes don't match, show error and reset
        Alert.alert(
          t.createPasscode.createPasscode,
          t.createPasscode.passcodesDoNotMatch
        );
        setPasscode("");
        setConfirmPasscode("");
        setIsConfirming(false);
      }
    }
  };

  const currentPasscode = isConfirming ? confirmPasscode : passcode;
  const title = isConfirming
    ? t.createPasscode.confirmPasscode
    : t.createPasscode.enterPasscode;

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
              {t.createPasscode.createPasscode}
            </Text>
          </View>

          <View className="flex-1" />

          <View className="pb-12 px-12 gap-6">
            <View className="items-center gap-4">
              <Text
                className="text-base font-mono"
                style={{ color: textColor, opacity: 0.8 }}
              >
                {title}
              </Text>
              <View className="flex-row gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <View
                    key={index}
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      borderColor: textColor,
                      backgroundColor:
                        index < currentPasscode.length
                          ? textColor
                          : "transparent",
                    }}
                  />
                ))}
              </View>
            </View>
            <PasscodeInput
              passcode={currentPasscode}
              onDigitPress={handleDigitPress}
              onDelete={handleDelete}
              disableBiometric={true}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

