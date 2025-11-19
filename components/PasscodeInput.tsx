import { BlurView } from "expo-blur";
import { Fingerprint, ScanFace } from "lucide-react-native";
import {
  Alert,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { useTheme } from "../utils/useTheme";

interface PasscodeInputProps {
  passcode: string;
  onDigitPress: (digit: string) => void;
  onDelete: () => void;
  disableBiometric?: boolean;
  onBiometricPress?: () => void;
  biometricEnabled?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const PasscodeInput = ({
  passcode,
  onDigitPress,
  onDelete,
  disableBiometric = false,
  onBiometricPress,
  biometricEnabled = false,
}: PasscodeInputProps) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const textColor = "#ffffff";
  const mutedColor = "#666666";

  // Calculate button size based on screen width
  // Account for padding (px-12 = 48px on each side) and gaps (3 gaps * gap size)
  const horizontalPadding = 48 * 2; // px-12 on both sides
  const gapSize = SCREEN_WIDTH * 0.03; // 3% of screen width for gaps
  const totalGapWidth = gapSize * 2; // 2 gaps between 3 buttons
  const availableWidth = SCREEN_WIDTH - horizontalPadding - totalGapWidth;
  const buttonSize = Math.min(availableWidth / 3, SCREEN_WIDTH * 0.22); // Max 22% of screen width
  const iconSize = buttonSize * 0.3; // Icon size relative to button
  const fontSize = buttonSize * 0.4; // Font size relative to button

  const digits = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["biometric", "0", "delete"],
  ];

  const renderButton = (value: string, row: number, col: number) => {
    if (value === "biometric") {
      const BiometricIcon = Platform.OS === "ios" ? ScanFace : Fingerprint;
      const alertTitle =
        Platform.OS === "ios"
          ? t.lockScreen.faceIdUnlock
          : t.lockScreen.fingerprintUnlock;
      const alertMessage =
        Platform.OS === "ios"
          ? t.lockScreen.faceIdNotEnabled
          : t.lockScreen.fingerprintNotEnabled;

      const isDisabled = disableBiometric || !biometricEnabled;

      return (
        <TouchableOpacity
          key={`${row}-${col}`}
          onPress={
            isDisabled
              ? undefined
              : onBiometricPress ||
                (() => {
                  Alert.alert(alertTitle, alertMessage);
                })
          }
          disabled={isDisabled}
          className="rounded-3xl items-center justify-center overflow-hidden border"
          style={{
            width: buttonSize,
            height: buttonSize,
            borderColor: mutedColor,
            borderWidth: 1,
            opacity: isDisabled ? 0.3 : 1,
          }}
        >
          {Platform.OS === "ios" ? (
            <BlurView
              intensity={20}
              tint={isDark ? "dark" : "light"}
              className="w-full h-full rounded-3xl items-center justify-center"
            >
              <BiometricIcon size={iconSize} color={textColor} />
            </BlurView>
          ) : (
            <View
              className="w-full h-full rounded-3xl items-center justify-center"
              style={{
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(255, 255, 255, 0.5)",
              }}
            >
              <BiometricIcon size={iconSize} color={textColor} />
            </View>
          )}
        </TouchableOpacity>
      );
    }

    if (value === "delete") {
      return (
        <TouchableOpacity
          key={`${row}-${col}`}
          onPress={onDelete}
          disabled={passcode.length === 0}
          className="rounded-3xl items-center justify-center overflow-hidden border"
          style={{
            width: buttonSize,
            height: buttonSize,
            borderColor: mutedColor,
            borderWidth: 1,
          }}
        >
          {Platform.OS === "ios" ? (
            <BlurView
              intensity={20}
              tint={isDark ? "dark" : "light"}
              className="w-full h-full rounded-3xl items-center justify-center"
            >
              <Text
                className="font-mono font-bold"
                style={{
                  color: textColor,
                  opacity: passcode.length === 0 ? 0.3 : 1,
                  fontSize: fontSize,
                }}
              >
                ⌫
              </Text>
            </BlurView>
          ) : (
            <View
              className="w-full h-full rounded-3xl items-center justify-center"
              style={{
                backgroundColor: isDark
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(255, 255, 255, 0.5)",
              }}
            >
              <Text
                className="font-mono font-bold"
                style={{
                  color: textColor,
                  opacity: passcode.length === 0 ? 0.3 : 1,
                  fontSize: fontSize,
                }}
              >
                ⌫
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        onPress={() => onDigitPress(value)}
        className="rounded-3xl items-center justify-center overflow-hidden border"
        style={{
          width: buttonSize,
          height: buttonSize,
          borderColor: mutedColor,
          borderWidth: 1,
        }}
      >
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={20}
            tint={isDark ? "dark" : "light"}
            className="w-full h-full rounded-3xl items-center justify-center"
          >
            <Text
              className="font-mono font-bold"
              style={{ color: textColor, fontSize: fontSize }}
            >
              {value}
            </Text>
          </BlurView>
        ) : (
          <View
            className="w-full h-full rounded-3xl items-center justify-center"
            style={{
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(255, 255, 255, 0.5)",
            }}
          >
            <Text
              className="font-mono font-bold"
              style={{ color: textColor, fontSize: fontSize }}
            >
              {value}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ gap: gapSize }}>
      {digits.map((row, rowIndex) => (
        <View
          key={rowIndex}
          className="flex-row justify-center"
          style={{ gap: gapSize }}
        >
          {row.map((digit, colIndex) =>
            renderButton(digit, rowIndex, colIndex)
          )}
        </View>
      ))}
    </View>
  );
};
