import React, { useState, ReactNode, useEffect } from 'react';
import { getUserStatus, userlogin } from '../api/services/authService';
import { AuthContext } from './AuthContext';
import { UserResult, UserParams } from '../interface/User';
import { clearTokenSync } from '../utils/storage';
import { eventEmitter, TOKEN_EXPIRED_EVENT } from '../utils/eventEmitter';
import { useNavigation } from '@react-navigation/native';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [initCheckLogin, setInitCheckLogin] = useState<boolean>(true);
  const navigation = useNavigation();

  const checkUserStatus = async () => {
    try {
      const res = await getUserStatus();
      res && setUser(res);
      setIsLoggedIn(!!res);
    } catch {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setInitCheckLogin(false);
    }
  };

  // 初始化时检查登录状态
  useEffect(() => {
    checkUserStatus();
  }, []);

  // 监听token过期事件
  useEffect(() => {
    const tokenExpiredListener = eventEmitter.addListener(TOKEN_EXPIRED_EVENT, () => {
      setUser(null);
      setIsLoggedIn(false);
      navigation.navigate('Auth');
    });
    return () => tokenExpiredListener.remove();
  }, [navigation]);

  // 登录函数
  const login = async (params: UserParams): Promise<boolean> => {
    try {
      const userData = await userlogin(params);
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
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
      console.log('退出登录失败:', error);
    }
  };

  const value = {
    user,
    isLoggedIn,
    initCheckLogin,
    login,
    logout,
    checkUserStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
