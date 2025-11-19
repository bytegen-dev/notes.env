import { BlurView } from "expo-blur";
import { ArrowRight } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../utils/i18n/LanguageContext";
import { useTheme } from "../utils/useTheme";

interface SplashScreenProps {
  onGetStarted: () => void;
  onImportSetup?: () => void;
}

const splashImages = [
  require("../assets/images/splash.gif"),
  require("../assets/images/splash-2.gif"),
  require("../assets/images/splash-3.gif"),
];

export const SplashScreen = ({
  onGetStarted,
  onImportSetup,
}: SplashScreenProps) => {
  const { t } = useLanguage();
  const theme = useTheme();
  const [splashIndex, setSplashIndex] = useState(0);

  const textColor = "#ffffff";
  const bgColor = "#000000";
  const isDark = theme.isDark;

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSplashClick = () => {
    setSplashIndex((prev) => (prev + 1) % splashImages.length);
  };

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
                    {t.splash.getStarted}
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
                    {t.splash.getStarted}
                  </Text>
                  <ArrowRight size={24} color={textColor} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};
