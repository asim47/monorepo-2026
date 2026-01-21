import { StoredKeys, localStorage } from '@/helpers/localStorage';

export type TokenType = {
    accessToken: string;
    refreshToken: string;
  }
export const getTokens = (): TokenType | null => {
    const accessToken = localStorage.getItem(StoredKeys.accessToken);
    const refreshToken = localStorage.getItem(StoredKeys.refreshToken);
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    return null;
  };
  
  export const removeTokens = () => {
    localStorage.removeItem(StoredKeys.accessToken);
    localStorage.removeItem(StoredKeys.refreshToken);
  };
  
  export const setTokens = (tokens: { accessToken: string; refreshToken: string }) => {
    localStorage.setItem(StoredKeys.accessToken, tokens.accessToken);
    localStorage.setItem(StoredKeys.refreshToken, tokens.refreshToken);
  };