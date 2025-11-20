import { BlurView } from "expo-blur";
import { ReactNode, useEffect, useRef } from "react";
import { Animated, Dimensions, Platform, Pressable, Text, View } from "react-native";
import { useTheme } from "../utils/useTheme";

interface DialogProps {
  visible: boolean;
  title: string;
  message?: string;
  children?: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmStyle?: "default" | "destructive";
}

export const Dialog = ({
  visible,
  title,
  message,
  children,
  onClose,
  onConfirm,
  confirmText,
  cancelText = "Cancel",
  confirmStyle = "default",
}: DialogProps) => {
  const { bgColor, borderColor, textColor, destructiveColor, isDark } =
    useTheme();
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0.95);
      opacityAnim.setValue(0);

      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  if (!visible) return null;

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const isSmallScreen = SCREEN_WIDTH < 375; // iPhone SE width is 375
  const dialogWidth = isSmallScreen 
    ? SCREEN_WIDTH - 32 // 16px margin on each side
    : Math.min(SCREEN_WIDTH * 0.85, 400);
  const padding = isSmallScreen ? 12 : 16;
  const titlePadding = isSmallScreen ? 12 : 16;

  const dialogContent = (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <Pressable
        onPress={(e) => e.stopPropagation()}
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
          width: dialogWidth,
          marginHorizontal: 16,
        }}
      >
        <View
          className="border-b"
          style={{ 
            borderBottomColor: borderColor,
            padding: titlePadding,
          }}
        >
          <Text 
            className="font-semibold" 
            style={{ 
              color: textColor,
              fontSize: isSmallScreen ? 16 : 18,
            }}
          >
            {title}
          </Text>
        </View>
        <View style={{ padding }}>
          {children ? (
            children
          ) : (
            <>
              {message && (
                <Text
                  className="mb-4"
                  style={{ 
                    color: textColor, 
                    opacity: 0.8,
                    fontSize: isSmallScreen ? 14 : 16,
                  }}
                >
                  {message}
                </Text>
              )}
              <View className="flex-row gap-3 justify-end">
                <Pressable 
                  onPress={onClose} 
                  style={{
                    paddingHorizontal: isSmallScreen ? 12 : 16,
                    paddingVertical: isSmallScreen ? 8 : 10,
                  }}
                  className="rounded-lg"
                >
                  <Text
                    className="font-semibold"
                    style={{ 
                      color: textColor,
                      fontSize: isSmallScreen ? 14 : 16,
                    }}
                  >
                    {cancelText}
                  </Text>
                </Pressable>
                {onConfirm && (
                  <Pressable
                    onPress={onConfirm}
                    style={{
                      paddingHorizontal: isSmallScreen ? 12 : 16,
                      paddingVertical: isSmallScreen ? 8 : 10,
                      backgroundColor:
                        confirmStyle === "destructive"
                          ? destructiveColor
                          : undefined,
                    }}
                    className="rounded-lg"
                  >
                    <Text
                      className="font-semibold"
                      style={{
                        color:
                          confirmStyle === "destructive"
                            ? "#ffffff"
                            : textColor,
                        fontSize: isSmallScreen ? 14 : 16,
                      }}
                    >
                      {confirmText || "Confirm"}
                    </Text>
                  </Pressable>
                )}
              </View>
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <View className="flex-1 justify-center items-center">
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={20}
          tint={isDark ? "dark" : "light"}
          className="absolute inset-0"
        >
          <Pressable
            onPress={onClose}
            className="flex-1 justify-center items-center"
          >
            {dialogContent}
          </Pressable>
        </BlurView>
      ) : (
        <Pressable
          onPress={onClose}
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          {dialogContent}
        </Pressable>
      )}
    </View>
  );
};
