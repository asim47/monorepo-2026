import { useMMKVBoolean } from 'react-native-mmkv';

import { storage, StoredKeys } from '@/helpers/localStorage';

const IS_FIRST_TIME = StoredKeys.firstOpen;

export const useIsFirstTime = () => {
  const [isFirstTime, setIsFirstTime] = useMMKVBoolean(IS_FIRST_TIME, storage);
  if (isFirstTime === undefined) {
    return [true, setIsFirstTime] as const;
  }
  return [isFirstTime, setIsFirstTime] as const;
};