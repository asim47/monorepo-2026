import { StyleSheet, View } from "react-native";
import { IconButton as PaperIconButton } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

const IconButton = ({
  disabled,
  icon,
  onPress,
  backgroundColor,
}: {
  disabled?: boolean;
  icon: IconSource;
  onPress: () => void;
  backgroundColor?: string;
}) => {
  return (
    <View style={[iconButtonStyles.container, { backgroundColor }]}>
      <PaperIconButton
        icon={icon}
        disabled={disabled}
        onPress={onPress}
        style={iconButtonStyles.iconButton}
      />
    </View>
  );
};

export default IconButton;

const iconButtonStyles = StyleSheet.create({
  container: {
    borderRadius: 100,
  },
  iconButton: {
    padding: 0,
    margin: 2,
  },
});
