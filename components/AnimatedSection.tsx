import { useEffect, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, View } from "react-native";

interface AnimatedSectionProps {
  children: React.ReactNode;
  isCollapsed: boolean;
}

export const AnimatedSection = ({
  children,
  isCollapsed,
}: AnimatedSectionProps) => {
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (contentHeight > 0) {
      Animated.timing(animatedHeight, {
        toValue: isCollapsed ? 0 : contentHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isCollapsed, contentHeight, animatedHeight]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height);
      animatedHeight.setValue(isCollapsed ? 0 : height);
    }
  };

  return (
    <Animated.View
      style={{
        overflow: "hidden",
        height: contentHeight > 0 ? animatedHeight : undefined,
      }}
    >
      <View onLayout={handleLayout}>{children}</View>
    </Animated.View>
  );
};
