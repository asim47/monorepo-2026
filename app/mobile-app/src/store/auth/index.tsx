import { create } from 'zustand';

import { Log } from '@/helpers/Logger';
import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import { getTokens, removeTokens, setTokens } from './utils';


interface AuthState {
  token: TokenType | null;
  status: 'idle' | 'signedOut' | 'signedIn';
  signIn: (data: TokenType) => void;
  signOut: () => void;
  hydrate: () => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  signIn: (token) => {
    setTokens(token);
    set({ status: 'signedIn', token });
  },
  signOut: () => {
    removeTokens();
    set({ status: 'signedOut', token: null });
  },
  hydrate: () => {
    try {
      const userToken = getTokens();
      if (userToken) {
        get().signIn(userToken);
      } else {
        get().signOut();
      }
    } catch (e) {
      Log("Error in hydrateAuth", e);
      get().signOut();
    }
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: TokenType) => _useAuth.getState().signIn(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();