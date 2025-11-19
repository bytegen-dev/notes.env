import { BlurView } from "expo-blur";
import { ReactNode, useEffect, useRef } from "react";
import { Animated, Platform, Pressable, Text, View } from "react-native";
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
          width: "80%",
          maxWidth: 400,
        }}
      >
        <View
          className="p-4 border-b"
          style={{ borderBottomColor: borderColor }}
        >
          <Text className="text-lg font-semibold" style={{ color: textColor }}>
            {title}
          </Text>
        </View>
        <View className="p-4">
          {children ? (
            children
          ) : (
            <>
              {message && (
                <Text
                  className="text-base mb-4"
                  style={{ color: textColor, opacity: 0.8 }}
                >
                  {message}
                </Text>
              )}
              <View className="flex-row gap-3 justify-end">
                <Pressable onPress={onClose} className="px-4 py-2 rounded-lg">
                  <Text
                    className="text-base font-semibold"
                    style={{ color: textColor }}
                  >
                    {cancelText}
                  </Text>
                </Pressable>
                {onConfirm && (
                  <Pressable
                    onPress={onConfirm}
                    className="px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor:
                        confirmStyle === "destructive"
                          ? destructiveColor
                          : undefined,
                    }}
                  >
                    <Text
                      className="text-base font-semibold"
                      style={{
                        color:
                          confirmStyle === "destructive"
                            ? "#ffffff"
                            : textColor,
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
