import React from 'react';
import { User } from '../interface/IModuleProps';

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<boolean>;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
});
