import { useThemeColor } from "@/hooks/useThemeColor";
import {
  CreatePlaceValidation,
  createPlaceValidation,
} from "@/validators/home/place.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type AddPlaceModalProps = {
  visible: boolean;
  onCancel: () => void;
  isLoading: boolean;
  onSave: (data: CreatePlaceValidation) => void;
};

export const AddPlaceModal = ({
  visible,
  onCancel,
  onSave,
  isLoading,
}: AddPlaceModalProps) => {
  const surface = useThemeColor("background");
  const textColor = useThemeColor("text");
  const primary = useThemeColor("primary");
  const muted = useThemeColor("gray");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePlaceValidation>({
    resolver: zodResolver(createPlaceValidation),
    defaultValues: {
      name: undefined,
      address: undefined,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  const handleSave = (data: CreatePlaceValidation) => {
    onSave(data);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.backdrop}
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, { backgroundColor: surface }]}>
          <Text style={[styles.title, { color: textColor }]}>
            Add new place
          </Text>

          <View style={styles.field}>
            <Text style={[styles.label, { color: textColor }]}>Place name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <View>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Place name"
                    placeholderTextColor={muted}
                    style={[
                      styles.input,
                      {
                        color: textColor,
                        borderBottomColor: errors.name ? "red" : muted,
                      },
                    ]}
                    returnKeyType="done"
                  />
                  {errors.name && (
                    <Text style={[styles.error, { color: "red" }]}>
                      {errors.name.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: textColor }]}>Address</Text>
            <Controller
              control={control}
              name="address"
              render={({ field: { value, onChange } }) => (
                <View>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Address"
                    placeholderTextColor={muted}
                    style={[
                      styles.input,
                      {
                        color: textColor,
                        borderBottomColor: errors.address ? "red" : muted,
                      },
                    ]}
                    returnKeyType="done"
                  />
                  {errors.address && (
                    <Text style={[styles.error, { color: "red" }]}>
                      {errors.address.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          <View style={styles.actionsRow}>
            <Pressable onPress={onCancel} style={styles.actionBtn} hitSlop={6}>
              <Text style={[styles.cancelText, { color: "#EA580C" }]}>
                Cancel
              </Text>
            </Pressable>
            {isLoading ? (
              <ActivityIndicator size="small" color={primary} />
            ) : (
              <Pressable
                onPress={handleSubmit(handleSave)}
                style={styles.actionBtn}
                hitSlop={6}
              >
                <Text style={[styles.saveText, { color: primary }]}>Save</Text>
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 24,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  field: {
    marginTop: 6,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    fontSize: 15,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
  saveText: {
    fontSize: 14,
    fontWeight: "600",
  },
  error: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
  },
});

export default AddPlaceModal;


