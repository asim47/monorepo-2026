import { useThemeColor } from "@/hooks/useThemeColor";
import { OTPInput, OTPInputRef, type SlotProps } from "input-otp-native";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

const OTPInputComponent = ({
  maxLength = 6,
  error,
  onComplete,
  onChangeText,
  editable = true,
  onBlur,
  onFocus,
  value,
}: {
  maxLength?: number;
  error?: string | null;
  onComplete: (code: string) => void;
  onChangeText: (text: string) => void;
  editable?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  value?: string;
}) => {
  const ref = useRef<OTPInputRef>(null);
  const errorColor = useThemeColor("error");

  return (
    <View>
      <OTPInput
        ref={ref}
        editable={editable}
        onComplete={(code) => {
          onComplete(code);
        }}
        onChange={(text) => {
          onChangeText(text);
        }}
        onBlur={onBlur}
        value={value}
        onFocus={onFocus}
        autoFocus={true}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={maxLength}
        render={({ slots }) => (
          <View style={styles.container}>
            <View style={styles.slotGroup}>
              {slots.map((slot, idx) => (
                <Slot key={idx} {...slot} isError={error !== null} />
              ))}
            </View>
          </View>
        )}
      />
      {error && (
        <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
      )}
    </View>
  );
};

function Slot({ char, isActive, isError }: SlotProps & { isError?: boolean }) {
  const backgroundColor = useThemeColor("inputBackground");
  const textColor = useThemeColor("text");
  const highlightColor = useThemeColor("gray");
  const errorColor = useThemeColor("error");

  console.log("char", char);
  console.log("isActive", isActive);
  console.log("isError", isError);

  return (
    <View
      style={[
        styles.slot,
        {
          backgroundColor,
          borderColor: isActive
            ? highlightColor
            : isError
            ? errorColor
            : backgroundColor,
          borderWidth: isError ? 2 : 2,
        },
      ]}
    >
      {char !== null && (
        <Text style={[styles.slotText, { color: textColor, fontFamily: "Roboto_500Medium" }]}>{char}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  slotGroup: {
    flexDirection: "row",
    gap: 10,
  },
  slot: {
    width: 48,
    height: 56,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 2,
  },
  slotText: {
    fontSize: 20,
    fontWeight: "400",
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  dashContainer: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  dash: {
    width: 8,
    height: 2,
    borderRadius: 2,
  },
  caretContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  caret: {
    width: 2,
    height: 32,
    borderRadius: 1,
  },
});

export default OTPInputComponent;
