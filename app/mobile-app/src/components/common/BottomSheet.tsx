import { useThemeColor } from '@/hooks/useThemeColor';
import type { BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import BottomSheetModal, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, ReactNode, useImperativeHandle, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface BottomSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface BottomSheetProps {
  title?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  children: ReactNode;
}

export const CommonBottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      title,
      confirmText = 'Confirm',
      onConfirm,
      onDismiss,
      snapPoints = ['50%'],
      enablePanDownToClose = true,
      children,
    },
    ref
  ) => {
    const bottomSheetRef = useRef<BottomSheetModalType>(null);
    const primaryColor = useThemeColor('primary');
    const textColor = useThemeColor('text');
    const insets = useSafeAreaInsets();

    useImperativeHandle(ref, () => ({
      present: () => {
        if (bottomSheetRef.current) {
          bottomSheetRef.current.expand();
        }
      },
      dismiss: () => {
        if (bottomSheetRef.current) {
          bottomSheetRef.current.dismiss();
        }
      },
    }));

    const handleConfirm = () => {
      onConfirm?.();
      bottomSheetRef.current?.dismiss();
    };

    const handleDismiss = () => {
      onDismiss?.();
    };

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        onChange={(index) => {
          if (index === -1) {
            handleDismiss();
          }
        }}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        enableContentPanningGesture={true}
      >
        <BottomSheetView style={[styles.contentContainer, { paddingBottom: insets.bottom }]}>
          {(title || onConfirm) && (
            <View style={styles.header}>
              {title && (
                <Text style={[styles.title, { color: textColor }]}>{title}</Text>
              )}
              {onConfirm && (
                <Pressable onPress={handleConfirm}>
                  <Text style={[styles.confirmButton, { color: primaryColor }]}>
                    {confirmText}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

CommonBottomSheet.displayName = 'CommonBottomSheet';

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#D1D5DB',
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  confirmButton: {
    fontSize: 16,
    fontWeight: '600',
  },
});

