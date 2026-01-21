import React, { createContext, ReactNode, useContext, useState } from 'react';

export type TestType = 'tapWater' | 'filteredWater' | 'monitoring' | null;

interface TestState {
  isTesting: boolean;
  testType: TestType;
}

interface MonitoringState {
  isMonitoring: boolean;
  monitoringInterval: number; // Total minutes
  monitoringStartTime: number | null; // Timestamp when monitoring started
  monitoringIntervalType: 'preset' | 'custom';
  customHours: number;
  customMinutes: number;
}

interface TestStateContextType {
  testState: TestState;
  monitoringState: MonitoringState;
  setIsTesting: (isTesting: boolean, testType: TestType) => void;
  resetTestState: () => void;
  startMonitoring: (intervalType: 'preset' | 'custom', minutes: number, hours?: number, customMinutes?: number) => void;
  stopMonitoring: () => void;
  getMonitoringElapsedTime: () => number; // Returns elapsed time in seconds
  getMonitoringIntervalDisplay: () => string; // Returns formatted interval string
  canAccessBottomSheet: () => boolean; // Returns true if bottom sheet should be accessible
}

const TestStateContext = createContext<TestStateContextType | undefined>(undefined);

export const TestStateProvider = ({ children }: { children: ReactNode }) => {
  const [testState, setTestState] = useState<TestState>({
    isTesting: false,
    testType: null,
  });

  const [monitoringState, setMonitoringState] = useState<MonitoringState>({
    isMonitoring: false,
    monitoringInterval: 0,
    monitoringStartTime: null,
    monitoringIntervalType: 'preset',
    customHours: 0,
    customMinutes: 0,
  });

  const setIsTesting = (isTesting: boolean, testType: TestType) => {
    setTestState({
      isTesting,
      testType,
    });
  };

  const resetTestState = () => {
    setTestState({
      isTesting: false,
      testType: null,
    });
  };

  const startMonitoring = (
    intervalType: 'preset' | 'custom',
    minutes: number,
    hours: number = 0,
    customMinutes: number = 0
  ) => {
    setMonitoringState({
      isMonitoring: true,
      monitoringInterval: minutes,
      monitoringStartTime: Date.now(),
      monitoringIntervalType: intervalType,
      customHours: hours,
      customMinutes: customMinutes,
    });
    setIsTesting(true, 'monitoring');
  };

  const stopMonitoring = () => {
    setMonitoringState({
      isMonitoring: false,
      monitoringInterval: 0,
      monitoringStartTime: null,
      monitoringIntervalType: 'preset',
      customHours: 0,
      customMinutes: 0,
    });
    setIsTesting(false, null);
  };

  const getMonitoringElapsedTime = (): number => {
    if (!monitoringState.isMonitoring || !monitoringState.monitoringStartTime) {
      return 0;
    }
    return Math.floor((Date.now() - monitoringState.monitoringStartTime) / 1000);
  };

  const getMonitoringIntervalDisplay = (): string => {
    if (monitoringState.monitoringIntervalType === 'custom') {
      if (monitoringState.customHours > 0) {
        if (monitoringState.customMinutes > 0) {
          return `${monitoringState.customHours} Hour${monitoringState.customHours > 1 ? 's' : ''} ${monitoringState.customMinutes} Minute${monitoringState.customMinutes > 1 ? 's' : ''}`;
        }
        return `${monitoringState.customHours} Hour${monitoringState.customHours > 1 ? 's' : ''}`;
      }
      return `${monitoringState.customMinutes} Minute${monitoringState.customMinutes > 1 ? 's' : ''}`;
    }
    return `${monitoringState.monitoringInterval} Minute${monitoringState.monitoringInterval > 1 ? 's' : ''}`;
  };

  const canAccessBottomSheet = (): boolean => {
    // Always allow bottom sheet access during monitoring tests
    // For other tests, block access if testing is active
    if (testState.testType === 'monitoring') {
      return true;
    }
    return !testState.isTesting;
  };

  return (
    <TestStateContext.Provider
      value={{
        testState,
        monitoringState,
        setIsTesting,
        resetTestState,
        startMonitoring,
        stopMonitoring,
        getMonitoringElapsedTime,
        getMonitoringIntervalDisplay,
        canAccessBottomSheet,
      }}
    >
      {children}
    </TestStateContext.Provider>
  );
};

export const useTestState = () => {
  const context = useContext(TestStateContext);
  if (context === undefined) {
    throw new Error('useTestState must be used within a TestStateProvider');
  }
  return context;
};

