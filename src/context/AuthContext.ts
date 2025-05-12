import React from 'react';
import { UserResult, UserParams } from '../interface/User';

export interface AuthContextType {
  user: UserResult | null;
  isLoggedIn: boolean;
  initCheckLogin: boolean;
  login: (params: UserParams) => Promise<boolean>;
  logout: () => Promise<void>;
  checkUserStatus: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  initCheckLogin: true,
  login: async () => false,
  logout: async () => {},
  checkUserStatus: async () => {},
});
