import { MMKV } from "react-native-mmkv";

export enum StoredKeys {
  firstOpen = "firstOpen",
  accessToken = "accessToken",
  refreshToken = "refreshToken",
  user = "user",
  deviceSetup = "deviceSetup",
  deviceName = "deviceName",
  guideCompleted = "guideCompleted",
  places = "places",
  currentPlaceId = "currentPlaceId",
  fingerprint = "fingerprint",
  // Tracks whether the Connect Device screen is currently visible
  connectDeviceVisible = "connectDeviceVisible",
}

export const storage = new MMKV({
  id: "waterdrop-app",
  encryptionKey: "waterdrop-app",
});

export const localStorage = {
  setItem: (key: StoredKeys, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: StoredKeys) => {
    const value = storage.getString(key);
    return value===undefined?null:value;
  },
  removeItem: (key: StoredKeys) => {
    storage.delete(key);
  },
  setJSON: (key: StoredKeys, value: unknown) => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch {
      // If stringify fails, ensure we don't write an invalid value
    }
  },
  getJSON: <T = unknown>(key: StoredKeys): T | null => {
    try {
      const str = storage.getString(key);
      if (str === undefined || str === null) return null;
      return JSON.parse(str) as T;
    } catch {
      return null;
    }
  },
};
