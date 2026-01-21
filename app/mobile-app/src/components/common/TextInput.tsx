
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ReturnKeyTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextInputKeyPressEventData,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { TextInput } from "react-native-paper";

const TextInputComponent = React.forwardRef<
  any,
  {
    /** React Component to display on the left side of the input field. Can be either `TextInput.Icon` or `TextInput.Affix`. */
    left?: React.ReactNode;
    /**
     * Custom React component or icon to display on the right side of the input field. Can be either `TextInput.Icon` or `TextInput.Affix`.
     *
     * Note: Will be overridden by password visibility toggle when `secureTextEntry` is true
     */
    right?: React.ReactNode;
    label?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    isPasswordVisible?: boolean;
    error?: boolean;
    readOnly?: boolean;
    onPress?: () => void;
    /** Called when the user presses inside the input (useful for editable={false} "picker" fields) */
    onPressIn?: () => void;
    value?: string;
    returnKeyType?: ReturnKeyTypeOptions;
    onKeyPress?: (
      event: NativeSyntheticEvent<TextInputKeyPressEventData>
    ) => void;
    onBlur?: () => void;
    onChangeText?: (text: string) => void;
    keyboardType?: KeyboardTypeOptions;
    onSubmitEditing?: () => void;
    errorMessage?: string;
    inputStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    multiline?: boolean;
    editable?: boolean;
    errorTextStyle?: TextStyle;
    numberOfLines?: number;
    returnKeyLabel?: string;
    disabled?: boolean;
  }
>(
  (
    {
      label,
      placeholder,
      readOnly = false,
      secureTextEntry = false,
      isPasswordVisible = false,
      value,
      onChangeText,
      onBlur,
      onPress,
      onPressIn,
      keyboardType,
      onSubmitEditing,
      errorMessage,
      inputStyle,
      containerStyle,
      error,
      left,
      right,
      autoCapitalize,
      multiline = false,
      editable = true,
      errorTextStyle,
      onKeyPress,
      returnKeyType,
      returnKeyLabel,
      disabled = false,
      numberOfLines = 1,
    },
    ref
  ) => {
    const inputColor = useThemeColor("text");
    const _labelColor = useThemeColor("text");
    const inputBackground = useThemeColor("inputBackground");
    const placeholderColor = useThemeColor("text");
    const errorColor = useThemeColor("error");
    const primaryColor = useThemeColor("primary");
    // On Android, wrap readOnly inputs with onPressIn in a Pressable for better touch handling
    const shouldWrapPressable =
      Platform.OS === "android" && readOnly && !!onPressIn;

    const textInput = (
      <TextInput
        ref={ref}
        left={left ? <TextInput.Icon icon={() => left} /> : undefined}
        error={error || !!errorMessage}
        keyboardType={keyboardType}
        label={label}
        mode="outlined"
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        returnKeyLabel={returnKeyLabel}
        returnKeyType={returnKeyType}
        onKeyPress={onKeyPress}
        onChangeText={onChangeText}
        onBlur={onBlur}
        onPressIn={shouldWrapPressable ? undefined : onPressIn}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        outlineColor={inputBackground}
        editable={editable}
        theme={{
          colors: {
            primary: primaryColor,
            background: inputBackground,
            error: errorColor,
            inversePrimary: inputBackground,
          },
          roundness: 27,
          isV3: true,
        }}
        contentStyle={[
          textInputStyles.input,
          { color: inputColor },
          { height: multiline ? 180 : 50 },
          inputStyle,
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        secureTextEntry={secureTextEntry}
        numberOfLines={multiline ? 4 : numberOfLines}
        right={
          secureTextEntry ? (
            isPasswordVisible ? (
              <TextInput.Icon icon="eye" onPress={onPress} />
            ) : (
              <TextInput.Icon icon="eye-off" onPress={onPress} />
            )
          ) : right ? (
            <TextInput.Icon icon={() => right} />
          ) : undefined
        }
      />
    );

    return (
      <View style={[textInputStyles.container, containerStyle]}>
        {shouldWrapPressable ? (
          <Pressable onPressIn={onPressIn}>{textInput}</Pressable>
        ) : (
          textInput
        )}
        {errorMessage ? (
          <Text
            style={{
              marginTop: 5,
              alignSelf: "center",
              color: errorColor,
              ...errorTextStyle,
            }}
          >
            {errorMessage}
          </Text>
        ) : null}
      </View>
    );
  }
);

TextInputComponent.displayName = "TextInputComponent";

export default TextInputComponent;
const textInputStyles = StyleSheet.create({
  container: {
    gap:5,
    width:'100%',
  },
  input: {
    height:50,
    
  },
});