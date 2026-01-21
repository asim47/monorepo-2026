import { useBottomSheet } from '@/context/BottomSheetContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface IntervalBottomSheetContentProps {
  onConfirm: (intervalType: 'preset' | 'custom', minutes: number, hours?: number, customMinutes?: number) => void;
  initialInterval?: number;
}

export interface IntervalBottomSheetContentRef {
  handleConfirm: () => void;
}

const IntervalBottomSheetContentComponent = forwardRef<IntervalBottomSheetContentRef, IntervalBottomSheetContentProps>(
  ({ onConfirm, initialInterval }, ref) => {
    const [selectedPreset, setSelectedPreset] = useState<number | null>(initialInterval || null);
    const [showCustom, setShowCustom] = useState(false);
    const [customHours, setCustomHours] = useState('0');
    const [customMinutes, setCustomMinutes] = useState('0');
    
    const primaryColor = useThemeColor('primary');
    const textColor = useThemeColor('text');
    const inputBackground = useThemeColor('inputBackground');

    const handleConfirm = () => {
      if (showCustom) {
        const hours = parseInt(customHours) || 0;
        const mins = parseInt(customMinutes) || 0;
        const totalMinutes = hours * 60 + mins;
        if (totalMinutes > 0) {
          onConfirm('custom', totalMinutes, hours, mins);
        }
      } else if (selectedPreset !== null) {
        onConfirm('preset', selectedPreset);
      }
    };

    useImperativeHandle(ref, () => ({
      handleConfirm,
    }));

    const presetIntervals = [3, 5, 10, 15];

    return (
      <>
        {/* Predefined Interval Buttons */}
        <View style={styles.intervalsContainer}>
          {presetIntervals.map((interval) => (
            <Pressable
              key={interval}
              style={[
                styles.intervalButton,
                selectedPreset === interval && !showCustom && styles.intervalButtonSelected,
                { backgroundColor: selectedPreset === interval && !showCustom ? primaryColor : '#F3F4F6' },
              ]}
              onPress={() => {
                setSelectedPreset(interval);
                setShowCustom(false);
              }}
            >
              <Text
                style={[
                  styles.intervalButtonText,
                  { color: selectedPreset === interval && !showCustom ? '#fff' : '#6B7280' },
                ]}
              >
                {interval} Mins
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Set Custom Button */}
        <Pressable
          style={[
            styles.customButton,
            { borderColor: primaryColor },
            showCustom && styles.customButtonActive,
          ]}
          onPress={() => {
            setShowCustom(!showCustom);
            if (!showCustom) {
              setSelectedPreset(null);
            }
          }}
        >
          <Text style={[styles.customButtonText, { color: primaryColor }]}>
            Set Custom
          </Text>
        </Pressable>

        {/* Custom Input Fields */}
        {showCustom && (
          <View style={styles.customInputsContainer}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: textColor }]}>Hours</Text>
              <View style={[styles.inputField, { backgroundColor: inputBackground, borderColor: primaryColor }]}>
                <TextInput
                  style={[styles.input, { color: primaryColor }]}
                  value={customHours}
                  onChangeText={setCustomHours}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: textColor }]}>Minutes</Text>
              <View style={[styles.inputField, { backgroundColor: inputBackground, borderColor: primaryColor }]}>
                <TextInput
                  style={[styles.input, { color: primaryColor }]}
                  value={customMinutes}
                  onChangeText={setCustomMinutes}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
        )}
      </>
    );
  }
);

// Hook to open interval bottom sheet
export const useIntervalBottomSheet = () => {
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const openIntervalBottomSheet = (
    onConfirm: (intervalType: 'preset' | 'custom', minutes: number, hours?: number, customMinutes?: number) => void,
    onDismiss?: () => void,
    initialInterval?: number
  ) => {
    let handleConfirmCallback: (() => void) | null = null;

    const content = (
      <IntervalBottomSheetContent 
        ref={(ref) => {
          if (ref) {
            handleConfirmCallback = ref.handleConfirm;
          }
        }}
        onConfirm={(intervalType, minutes, hours, customMinutes) => {
          closeBottomSheet();
          onConfirm(intervalType, minutes, hours, customMinutes);
        }}
        initialInterval={initialInterval}
      />
    );

    openBottomSheet({
      title: 'Set Interval Please',
      confirmText: 'Confirm',
      onConfirm: () => {
        if (handleConfirmCallback) {
          handleConfirmCallback();
        }
      },
      onDismiss,
      snapPoints: ['40%'],
      children: content,
    });
  };

  return { openIntervalBottomSheet, closeBottomSheet };
};

const styles = StyleSheet.create({
  intervalsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  intervalButton: {
    flex: 1,
    // paddingVertical: 12,
    // paddingHorizontal: 16,
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  intervalButtonSelected: {
    // Selected state handled by backgroundColor
  },
  intervalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  customButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '35%',
    borderRadius: 200,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  customButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  customButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  customInputsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    width: '50%',
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputField: {
    borderRadius: 200,
    borderWidth: 2,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

IntervalBottomSheetContentComponent.displayName = 'IntervalBottomSheetContent';

export const IntervalBottomSheetContent = IntervalBottomSheetContentComponent;
