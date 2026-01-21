import { Platform } from 'react-native';

export const Log = (...logs: any) => {
  if (__DEV__ === false) {
    return;
  }

  console.info(`Platform ${Platform.OS} - ${new Date().toString()} => `, ...logs);
};
