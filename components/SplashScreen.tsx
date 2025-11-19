import { BlurView } from "expo-blur";
import { ArrowRight } from "lucide-react-native";
import { useRef } from "react";
import {
  Animated,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../utils/useTheme";

interface SplashScreenProps {
  onGetStarted: () => void;
  onImportSetup?: () => void;
}

export const SplashScreen = ({
  onGetStarted,
  onImportSetup,
}: SplashScreenProps) => {
  const {
    bgColor,
    textColor,
    cardBg,
    borderColor,
    mutedColor,
    accentColor,
    isDark,
  } = useTheme();

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleGetStarted = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onGetStarted();
    });
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
      }}
    >
      <ImageBackground
        source={require("../assets/images/splash.gif")}
        resizeMode="cover"
        className="flex-1"
        style={{ backgroundColor: bgColor }}
      >
        <View className="pt-40 items-center">
          <Text
            className="text-5xl font-mono font-bold tracking-tighter"
            style={{ color: textColor }}
          >
            notes.env
          </Text>
        </View>

        <View className="flex-1" />

        <View className="pb-12 px-12 gap-3">
          <TouchableOpacity
            onPress={handleGetStarted}
            className="rounded-full border overflow-hidden"
            style={{
              borderColor: textColor,
              borderWidth: 1,
            }}
          >
            {Platform.OS === "ios" ? (
              <BlurView
                intensity={20}
                tint={isDark ? "dark" : "light"}
                className="py-4 px-6 flex-row items-center justify-center gap-4"
              >
                <Text
                  className="text-xl font-mono font-bold tracking-tighter"
                  style={{ color: textColor }}
                >
                  死神を目覚めさせる
                </Text>
                <ArrowRight size={24} color={textColor} />
              </BlurView>
            ) : (
              <View
                className="py-4 px-6 flex-row items-center justify-center gap-4"
                style={{
                  backgroundColor: isDark
                    ? "rgba(0, 0, 0, 0.5)"
                    : "rgba(255, 255, 255, 0.5)",
                }}
              >
                <Text
                  className="text-xl font-mono font-bold tracking-tighter"
                  style={{ color: textColor }}
                >
                  Get Started
                </Text>
                <ArrowRight size={24} color={textColor} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};
