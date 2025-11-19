import { useEffect, useRef } from "react";
import { Animated, Dimensions, PanResponder, TouchableOpacity, View } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../utils/useTheme";

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.75; // 75% of screen width

export const Sidebar = ({ visible, onClose }: SidebarProps) => {
  const { cardBg, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes from the sidebar
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow swiping left (negative dx)
        if (gestureState.dx < 0) {
          slideAnim.setValue(Math.max(-SIDEBAR_WIDTH, gestureState.dx));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped more than 50% of sidebar width, close it
        if (gestureState.dx < -SIDEBAR_WIDTH / 2 || gestureState.velocityX < -500) {
          onClose();
        } else {
          // Snap back to open position
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-[2000]" pointerEvents={visible ? "auto" : "none"}>
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="absolute inset-0"
      >
        <BlurView
          intensity={20}
          tint={isDark ? "dark" : "light"}
          className="absolute inset-0"
        />
      </TouchableOpacity>

      {/* Sidebar */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          backgroundColor: cardBg,
          transform: [{ translateX: slideAnim }],
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View className="flex-1 p-4">
          {/* Sidebar content - blank for now */}
        </View>
      </Animated.View>
    </View>
  );
};

