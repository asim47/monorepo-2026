import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import { Fonts } from "@/constants/fonts";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ChevronDown } from "lucide-react-native";
import RNPickerSelect from "react-native-picker-select";

const DropDownComponent = ({
  placeholder,
  value,
  errorMessage,
  containerStyle,
  error,
  options,
  errorTextStyle,
  setValue,
  icon,
}: {
  /** React Component to display on the left side of the input field. Can be either `TextInput.Icon` or `TextInput.Affix`. */
  left?: React.ReactNode;
  /**
   * Custom React component or icon to display on the right side of the input field. Can be either `TextInput.Icon` or `TextInput.Affix`.
   *
   * Note: Will be overridden by password visibility toggle when `secureTextEntry` is true
   */
  right?: React.ReactNode;
  placeholder?: string;
  label?: string;
  error?: boolean;
  value?: string;
  errorMessage?: string;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  options: { label: string; value: string }[];
  setValue: (value: string) => void;
  errorTextStyle?: TextStyle;
  icon?: React.ReactNode;
}) => {
  const [menu, setMenu] = useState<View | null>(null);
  const [width, setWidth] = useState(0);
  const inputColor = useThemeColor("text");
  const primaryColor = useThemeColor("primary");
  const inputBackground = useThemeColor("inputBackground");
  const placeholderColor = useThemeColor("text");
  const errorColor = useThemeColor("error");
  const secondaryText = useThemeColor("secondaryText");
  const [open, _setOpen] = useState(false);
  useEffect(() => {
    menu?.measure((_x, _y, width, _height, _pageX, _pageY) => {
      setWidth(width);
    });
  }, [open, menu]);
  return (
    <View ref={setMenu} style={[textInputStyles.container, containerStyle]}>
      {Platform.OS === "ios" ? (
        <RNPickerSelect
          items={options}
          value={value}
          fixAndroidTouchableBug
          placeholder={{
            label: placeholder || "Select an option",
            value: null,
          }}
          useNativeAndroidPickerStyle={false}
          onValueChange={(itemValue) => setValue(itemValue)}
          Icon={() => icon || <ChevronDown size={20} color={inputColor} />}
          touchableWrapperProps={{
            hitSlop: { top: 15, bottom: 15, right: 270 },
          }}
          style={{
            inputIOSContainer: {
              pointerEvents: "none",
              width: width,
            },
            iconContainer: {
              position: "absolute",
              right: 20,
              top: 0,
            },
            inputIOS: {
              color: inputColor,
              fontSize: 14,
              ...Fonts.Roboto.regular,
              paddingLeft: 7,
            },
            placeholder: {
              color: placeholderColor,
            },
            viewContainer: {
              backgroundColor: inputBackground,
              paddingHorizontal: 10,
              borderWidth: error ? 2 : 0,
              borderColor: error ? errorColor : undefined,
              borderRadius: 32,
              height: 55,
              width: "100%",
              justifyContent: "center",
              alignItems: "flex-start",
            },
            inputAndroid: {
              pointerEvents: "none",
              width: "100%",
              height: 50,
            },
          }}
        ></RNPickerSelect>
      ) : (
        <Dropdown
          data={options}
          valueField="value"
          labelField="label"
          placeholder={placeholder || "Select an option"}
          value={value}
          onChange={(item) => setValue(item.value)}
          selectedTextStyle={{
            color: placeholderColor,
          }}
          placeholderStyle={{
            color: placeholderColor,
          }}
          itemTextStyle={{
            color: placeholderColor,
          }}
          renderItem={(item, selected) => (
            <View
              style={{
                backgroundColor: selected ? primaryColor : inputBackground,
                height: 55,
                width: "100%",
                paddingHorizontal: 10,
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: selected ? secondaryText : placeholderColor }}
              >
                {item.label}
              </Text>
            </View>
          )}
          selectedTextProps={{
            style: {
              color: inputColor,
              backgroundColor: inputBackground,
            },
          }}
          style={{
            backgroundColor: inputBackground,
            width: "100%",
            height: 55,
            paddingHorizontal: 10,
            borderRadius: 32,
          }}
          containerStyle={{
            marginTop: 5,
            backgroundColor: inputBackground,
          }}
          renderRightIcon={() => (
            <ChevronDown size={20} color={primaryColor} style={{ right: 6 }} />
          )}
        />
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
};

export default DropDownComponent;

const textInputStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    height: 50,
  },
});
