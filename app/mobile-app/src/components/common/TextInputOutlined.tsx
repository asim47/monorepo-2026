
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  KeyboardTypeOptions,
  NativeSyntheticEvent,
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
    autoFocus?: boolean;
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
    returnKeyLabel?: string;
    /** Override text color inside the input */
    textColor?: string;
    /** Override outline/border color (focused and unfocused) */
    outlineColor?: string;
    /** Override placeholder text color */
    placeholderTextColor?: string;
    /** Override outline/border width */
    outlineWidth?: number;
  }
>(
  (
    {
      label,
      placeholder,
      secureTextEntry = false,
      isPasswordVisible = false,
      autoFocus = false,
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
      textColor,
      outlineColor,
      placeholderTextColor,
      outlineWidth,
    },
    ref
  ) => {
    const inputColor = useThemeColor("text");
    const inputBackground = "transparent";
    const placeholderColorDefault = useThemeColor("text");
    const errorColor = useThemeColor("error");
    const defaultOutlineColor = useThemeColor("gray");
    const resolvedTextColor = textColor ?? inputColor;
    const resolvedOutlineColor = outlineColor ?? defaultOutlineColor;
    const resolvedPlaceholderColor =
      placeholderTextColor ?? placeholderColorDefault;
    return (
      <View style={[textInputStyles.container, containerStyle]}>
        <TextInput
          ref={ref}
          left={left ? <TextInput.Icon icon={() => left} /> : undefined}
          error={error || !!errorMessage}
          keyboardType={keyboardType}
          label={label}
          mode="outlined"
          value={value}
          returnKeyLabel={returnKeyLabel}
          returnKeyType={returnKeyType}
          onKeyPress={onKeyPress}
          onChangeText={onChangeText}
          onBlur={onBlur}
          onPressIn={onPressIn}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          outlineColor={resolvedOutlineColor}
          outlineStyle={{ borderWidth: outlineWidth ?? 1 }}
          editable={editable}
          autoFocus={autoFocus}
          theme={{
            colors: {
              primary: resolvedOutlineColor,
              background: inputBackground,
              error: errorColor,
              inversePrimary: resolvedOutlineColor,
            },
            roundness: 27,
            isV3: true,
          }}
          contentStyle={[
            textInputStyles.input,
            { color: resolvedTextColor },
            { height: multiline ? 100 : 50 },
            { paddingTop: multiline ? 10 : 0 },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={resolvedPlaceholderColor}
          secureTextEntry={secureTextEntry}
          numberOfLines={multiline ? 4 : 1}
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
        {errorMessage ? (
          <Text
            style={{
              marginTop: 5,
              alignSelf: "center",
              color: errorColor,
              fontWeight: "600",
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