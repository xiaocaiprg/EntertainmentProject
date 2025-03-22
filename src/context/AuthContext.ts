import React from 'react';
import { UserResult, UserParams } from '../interface/User';

export interface AuthContextType {
  user: UserResult | null;
  isLoggedIn: boolean;
  login: (params: UserParams) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: async () => false,
  logout: async () => {},
});
