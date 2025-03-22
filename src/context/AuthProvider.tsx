import React, { useState, ReactNode, useEffect } from 'react';
import { userlogin } from '../api/services/authService';
import { AuthContext } from './AuthContext';
import { UserResult, UserParams } from '../interface/User';
import { clearTokenSync } from '../utils/storage';

// 认证提供者组件属性
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 初始化时检查登录状态
  useEffect(() => {}, []);

  // 登录函数
  const login = async (params: UserParams): Promise<boolean> => {
    try {
      const userData = await userlogin(params);
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  };

  // 退出登录函数
  const logout = async (): Promise<void> => {
    try {
      // 清空本地token
      clearTokenSync();
      // 清除用户信息并更新登录状态
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
