import React, { useState, ReactNode, useEffect } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  checkLoginStatus,
} from '../api/services/authService';
import { AuthContext } from './AuthContext';
import { User } from '../interface/IModuleProps';

// 认证提供者组件属性
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 初始化时检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await checkLoginStatus();
        if (userData) {
          setUser(userData);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
      }
    };

    checkAuth();
  }, []);

  // 登录函数
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 调用登录API
      const userData = await apiLogin(username, password);
      setUser(userData);
      setIsLoggedIn(true);
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
      setIsLoggedIn(true);
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
      setIsLoggedIn(false);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
