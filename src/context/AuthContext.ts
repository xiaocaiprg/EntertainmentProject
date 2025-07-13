import React from 'react';
import { UserParams } from '../interface/User';
import { BusinessDto } from '../interface/Business';

export interface AuthContextType {
  user: BusinessDto | null;
  isLoggedIn: boolean;
  initCheckLogin: boolean;
  isDownloading: boolean;
  login: (params: UserParams) => Promise<boolean>;
  logout: () => Promise<void>;
  checkUserStatus: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  initCheckLogin: true,
  isDownloading: false,
  login: async () => false,
  logout: async () => {},
  checkUserStatus: async () => {},
});
