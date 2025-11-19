import { ReactNode, cloneElement, isValidElement } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "../utils/useTheme";

interface IconButtonProps {
  onPress?: () => void;
  children: ReactNode;
  variant?: "filled" | "outline";
  style?: ViewStyle;
}

export const IconButton = ({
  onPress,
  children,
  variant = "filled",
  style,
}: IconButtonProps) => {
  const { accentColor, mutedColor } = useTheme();
  const isOutline = variant === "outline";
  const isDisabled = !onPress;

  // Icon color: for outline use accent color, for filled use contrast color
  // If disabled, use muted color
  const iconColor = isDisabled
    ? mutedColor
    : isOutline
    ? accentColor
    : accentColor === "#ffffff"
    ? "#000000"
    : "#ffffff";

  // Clone the child element and apply the icon color (only if child doesn't already have color)
  const childrenWithColor = isValidElement(children)
    ? cloneElement(children as any, {
        color: (children as any).props?.color || iconColor,
      })
    : children;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className="w-11 h-11 rounded-full justify-center items-center"
      style={[
        isOutline
          ? {
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: accentColor,
            }
          : {
              backgroundColor: accentColor,
              borderWidth: accentColor === "#ffffff" ? 1 : 0,
              borderColor: "#e0e0e0",
            },
        style,
      ]}
    >
      {childrenWithColor}
    </TouchableOpacity>
  );
};

