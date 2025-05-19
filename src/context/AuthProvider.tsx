import React, { useState, ReactNode, useEffect } from 'react';
import { getSetting, getUserStatus, userlogin } from '../api/services/authService';
import { AuthContext } from './AuthContext';
import { UserResult, UserParams } from '../interface/User';
import { clearTokenSync } from '../utils/storage';
import { eventEmitter, TOKEN_EXPIRED_EVENT } from '../utils/eventEmitter';
import { useNavigation } from '@react-navigation/native';
import UpdateManager, {
  APP_DOWNLOADING_EVENT,
  APP_DOWNLOAD_COMPLETE_EVENT,
  APP_DOWNLOAD_PROGRESS_EVENT,
} from '../utils/UpdateManager';
import { isAndroid } from '../utils/platform';
import DownloadProgressModal from '../components/DownloadProgressModal';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [initCheckLogin, setInitCheckLogin] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const navigation = useNavigation();

  // 下载状态监听
  useEffect(() => {
    const downloadingListener = eventEmitter.addListener(APP_DOWNLOADING_EVENT, () => {
      setIsDownloading(true);
    });

    const downloadCompleteListener = eventEmitter.addListener(APP_DOWNLOAD_COMPLETE_EVENT, () => {
      setIsDownloading(false);
    });

    // 使用事件监听替代回调注册
    const progressListener = eventEmitter.addListener(
      APP_DOWNLOAD_PROGRESS_EVENT,
      (data: { show: boolean; progress?: number }) => {
        setShowProgressModal(data.show);
        if (data.progress !== undefined) {
          setDownloadProgress(data.progress);
        }
      },
    );

    return () => {
      downloadingListener.remove();
      downloadCompleteListener.remove();
      progressListener.remove();
    };
  }, []);

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

  // 初始化时检查登录状态和应用更新
  useEffect(() => {
    checkUserStatus();
    getSetting().then((res) => {
      if (res && res.switch && isAndroid()) {
        UpdateManager.checkUpdate();
      }
    });
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
    // 如果正在下载更新，禁止登录
    if (isDownloading) {
      return false;
    }

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
    isDownloading, // 导出下载状态，供UI使用
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <DownloadProgressModal visible={showProgressModal} progress={downloadProgress} />
    </AuthContext.Provider>
  );
};
