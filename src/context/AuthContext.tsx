import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api';

// 定义认证上下文类型
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件属性
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // 登录函数
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 调用登录API
      const userData = await apiLogin(username, password);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  };

  // 注册函数
  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      // 调用注册API
      const userData = await apiRegister(username, password);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('注册失败:', error);
      return false;
    }
  };

  // 登出函数
  const logout = async () => {
    try {
      // 调用登出API
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 自定义Hook，用于在组件中使用认证上下文
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};
