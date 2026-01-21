import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";

type AlertAction = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

const CustomAlert = ({
  visible,
  title,
  subtitle,
  actions,
  onDismiss,
}: {
  visible: boolean;
  title: string;
  subtitle?: string;
  actions: AlertAction[];
  onDismiss: () => void;
}) => {
  const textColor = useThemeColor("text");
  const secondaryText = useThemeColor("secondaryText");
  const primary = useThemeColor("primary");
  const alertBackground = useThemeColor("alertBackground");
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={[styles.dialog, { backgroundColor: alertBackground }]}>
        <Dialog.Title>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        </Dialog.Title>
        {subtitle ? (
          <Dialog.Content>
            <Text style={[styles.subtitle, { color: textColor }]}>{subtitle}</Text>
          </Dialog.Content>
        ) : null}
        <Dialog.Actions style={styles.actions}>
          {actions.map((action, index) => (
            <Button
              key={`${action.label}-${index}`}
              mode={action.variant === "primary" ? "contained" : action.variant === "secondary" ? "outlined" : "text"}
              onPress={action.onPress}
              style={[
                styles.actionButton,
                action.variant === "primary" && { backgroundColor: primary },
                action.variant === "secondary" && { borderColor: primary },
              ]}
              labelStyle={{ color: action.variant === "primary" ? secondaryText : primary }}
            >
              {action.label}
            </Button>
          ))}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.9,
  },
  actions: {
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  actionButton: {
    borderRadius: 100,
  },
});


