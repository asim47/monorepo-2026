import { useThemeColor } from "@/hooks/useThemeColor";

import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Button } from "react-native-paper";

const PrimaryButton = ({
  icon,
  label,
  disabled,
  onPress,
  isLoading,
  labelStyle,
  buttonStyle,
}: {
  icon?: React.ReactNode;
  label: string;
  disabled?: boolean;
  onPress: () => void;
  isLoading?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}) => {
  const styles = primaryButtonStyles;
  const backgroundColor = useThemeColor("primary");
  const disabledBackgroundColor = useThemeColor("primary");
  const textColor = useThemeColor("secondaryText");
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={[
        styles.primaryButton,
        { backgroundColor },
        buttonStyle,
        disabled && { backgroundColor: disabledBackgroundColor, opacity: 0.7 },
      ]}
      labelStyle={[styles.primaryButtonLabel, { color: textColor }, labelStyle]}
      disabled={disabled}
      loading={isLoading}
    >
      {icon}
      {label}
    </Button>
  );
};

export default PrimaryButton;

const primaryButtonStyles = StyleSheet.create({
  primaryButton: {
    borderRadius: 100,
  },
  primaryButtonLabel: {
    fontSize: 20,
    fontWeight: "600",
  },
});