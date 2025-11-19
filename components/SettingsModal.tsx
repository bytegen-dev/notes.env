import { BlurView } from "expo-blur";
import { X } from "lucide-react-native";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../utils/useTheme";
import { IconButton } from "./IconButton";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onClearData: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const SettingsModal = ({
  visible,
  onClose,
  onClearData,
  onExport,
  onImport,
}: SettingsModalProps) => {
  const {
    textColor,
    mutedColor,
    isDark,
    cardBg,
    borderColor,
    destructiveColor,
  } = useTheme();

  // Use a muted background for the modal
  const modalBg = isDark ? "#0a0a0a" : "#fafafa";

  const handleClearData = () => {
    Alert.alert(
      "データをクリア",
      "本当に被害者を完全に削除しますか？この操作は元に戻すことができません。被害者は永遠に失われます。",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "データをクリア",
          style: "destructive",
          onPress: onClearData,
        },
      ]
    );
  };

  const headerContent = (
    <View className="flex-row justify-between items-center">
      <IconButton onPress={onClose} variant="outline">
        <X size={24} strokeWidth={2.5} />
      </IconButton>
      <Text className="text-lg font-semibold" style={{ color: textColor }}>
        設定
      </Text>
      <View className="w-11" />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: modalBg }}>
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={20}
            tint={isDark ? "dark" : "light"}
            className="absolute top-0 left-0 right-0 pt-4 pb-4 px-4 z-[1000] border-b"
            style={{ borderBottomColor: "rgba(128, 128, 128, 0.2)" }}
          >
            {headerContent}
          </BlurView>
        ) : (
          <View
            className="absolute top-0 left-0 right-0 pt-4 pb-4 px-4 z-[1000] border-b"
            style={{
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.5)"
                : "rgba(255, 255, 255, 0.5)",
              borderBottomColor: "rgba(128, 128, 128, 0.2)",
            }}
          >
            {headerContent}
          </View>
        )}

        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ paddingTop: 70 }}
        >
          <TouchableOpacity
            onPress={onImport}
            className="p-4 rounded-xl border mb-3"
            style={{
              backgroundColor: cardBg,
              borderColor: borderColor,
            }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: textColor }}
            >
              被害者をインポート
            </Text>
            <Text className="text-sm mt-1" style={{ color: mutedColor }}>
              被害者をJSONファイルからインポート
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onExport}
            className="p-4 rounded-xl border mb-3"
            style={{
              backgroundColor: cardBg,
              borderColor: borderColor,
            }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: textColor }}
            >
              被害者をエクスポート
            </Text>
            <Text className="text-sm mt-1" style={{ color: mutedColor }}>
              被害者をJSONファイルとしてエクスポート
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleClearData}
            className="p-4 rounded-xl border mb-3"
            style={{
              backgroundColor: destructiveColor,
              borderColor: destructiveColor,
            }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: "#ffffff" }}
            >
              データをクリア
            </Text>
            <Text
              className="text-sm mt-1"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              アプリをリセットして被害者を完全に削除
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};
