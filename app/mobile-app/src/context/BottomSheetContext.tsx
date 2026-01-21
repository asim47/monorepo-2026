import { useThemeColor } from '@/hooks/useThemeColor';
import type { BottomSheetModal as BottomSheetModalType } from '@gorhom/bottom-sheet';
import BottomSheetModal, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { createContext, ReactNode, useContext, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetConfig {
  title?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  enableContentPanningGesture?: boolean;
  enableHandlePanningGesture?: boolean;
  children: ReactNode;
}

interface BottomSheetContextType {
  openBottomSheet: (config: BottomSheetConfig) => void;
  closeBottomSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const bottomSheetRef = useRef<BottomSheetModalType>(null);
  const [bottomSheetConfig, setBottomSheetConfig] =
    useState<BottomSheetConfig | null>(null);
  const primaryColor = useThemeColor("primary");
  const textColor = useThemeColor("text");
  const insets = useSafeAreaInsets();

  const openBottomSheet = (config: BottomSheetConfig) => {
    setBottomSheetConfig(config);
    // Use setTimeout to ensure state is updated before presenting
    setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 0);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    // Clear config after a delay to allow animation
    setTimeout(() => {
      setBottomSheetConfig(null);
    }, 300);
  };

  const handleConfirm = () => {
    bottomSheetConfig?.onConfirm?.();
    closeBottomSheet();
  };

  const handleDismiss = () => {
    bottomSheetConfig?.onDismiss?.();
    closeBottomSheet();
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
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}
      {bottomSheetConfig && (
        <BottomSheetModal
          ref={bottomSheetRef}
          snapPoints={bottomSheetConfig.snapPoints || ["50%"]}
          enablePanDownToClose={
            bottomSheetConfig.enablePanDownToClose !== undefined
              ? bottomSheetConfig.enablePanDownToClose
              : true
          }
          onChange={(index) => {
            if (index === -1) {
              handleDismiss();
            }
          }}
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
          enableContentPanningGesture={
            bottomSheetConfig.enableContentPanningGesture !== undefined
              ? bottomSheetConfig.enableContentPanningGesture
              : true
          }
          enableHandlePanningGesture={
            bottomSheetConfig.enableHandlePanningGesture !== undefined
              ? bottomSheetConfig.enableHandlePanningGesture
              : true
          }
        >
          <BottomSheetView
            style={[styles.contentContainer, { paddingBottom: insets.bottom }]}
          >
            {(bottomSheetConfig.title || bottomSheetConfig.onConfirm) && (
              <View style={styles.header}>
                {bottomSheetConfig.title && (
                  <Text style={[styles.title, { color: textColor }]}>
                    {bottomSheetConfig.title}
                  </Text>
                )}
                {bottomSheetConfig.onConfirm && (
                  <Pressable onPress={handleConfirm}>
                    <Text
                      style={[styles.confirmButton, { color: primaryColor }]}
                    >
                      {bottomSheetConfig.confirmText || "Confirm"}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
            {bottomSheetConfig.children}
          </BottomSheetView>
        </BottomSheetModal>
      )}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};

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

