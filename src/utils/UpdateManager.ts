import { Alert, ToastAndroid } from 'react-native';
import { UpdateAPK } from 'rn-update-apk';
import RNFS from 'react-native-fs';
import { eventEmitter } from '../utils/eventEmitter';
import { isAndroid } from './platform';

// 导出事件名称，用于在应用中监听下载状态
export const APP_DOWNLOADING_EVENT = 'app_downloading_event';
export const APP_DOWNLOAD_COMPLETE_EVENT = 'app_download_complete_event';
export const APP_DOWNLOAD_PROGRESS_EVENT = 'app_download_progress_event';

// 动态获取package.json中的版本号
const pkgJson = require('../../package.json');
const currentAppVersion = pkgJson.version;

class UpdateManager {
  private updateAPK: UpdateAPK | null = null;
  private isDownloading: boolean = false;

  constructor() {
    // 只在Android平台初始化更新功能
    if (!isAndroid()) {
      return;
    }

    try {
      // 获取设备下载目录（优先使用应用缓存目录，不需要存储权限）
      const downloadDir = RNFS.CachesDirectoryPath;
      console.log('下载目录:', downloadDir);

      // 创建更新对象
      this.updateAPK = new UpdateAPK({
        apkVersionUrl: 'https://junlongpro.com/image/apk_version.json',
        fileProviderAuthority: 'com.entertainmentproject.provider',
        // 使用应用缓存目录，无需存储权限
        downloadDestDirectory: downloadDir,
        needUpdateApp: (confirmUpdate: (isUpdate: boolean) => void) => {
          try {
            Alert.alert(
              '发现新版本',
              `当前版本: ${currentAppVersion}\n是否立即更新到最新版本？`,
              [
                {
                  text: '取消',
                  onPress: () => {
                    try {
                      confirmUpdate(false);
                      ToastAndroid.show('已取消更新', ToastAndroid.SHORT);
                    } catch (error) {
                      console.error('取消更新时出错:', error);
                    }
                  },
                  style: 'cancel',
                },
                {
                  text: '更新',
                  onPress: () => {
                    try {
                      this.isDownloading = true;
                      // 发送事件通知应用正在下载更新，禁止登录
                      eventEmitter.emit(APP_DOWNLOADING_EVENT);
                      ToastAndroid.show('开始下载更新', ToastAndroid.SHORT);
                      confirmUpdate(true);
                    } catch (error) {
                      console.error('确认更新时出错:', error);
                      ToastAndroid.show('更新过程出错', ToastAndroid.LONG);
                    }
                  },
                },
              ],
              { cancelable: false },
            );
          } catch (error) {
            console.error('显示更新对话框时出错:', error);
          }
        },
        onError: (err) => {
          console.error('更新错误:', err);
          try {
            // 重置下载状态
            this.isDownloading = false;
            eventEmitter.emit(APP_DOWNLOAD_COMPLETE_EVENT);

            // 发送进度事件（关闭进度条）
            eventEmitter.emit(APP_DOWNLOAD_PROGRESS_EVENT, { show: false });

            Alert.alert('更新失败', '应用更新失败，请稍后重试。如果持续失败，请手动下载安装。', [
              {
                text: '确定',
                onPress: () => {
                  // 用户确认后不做任何操作
                },
              },
            ]);
          } catch (alertError) {
            console.error('显示错误提示时出错:', alertError);
            ToastAndroid.show('更新失败，请稍后重试', ToastAndroid.LONG);
          }
        },
        downloadApkStart: () => {
          try {
            ToastAndroid.show('正在后台下载更新，请稍候...', ToastAndroid.LONG);
            // 发送进度事件（显示进度条，初始进度0%）
            eventEmitter.emit(APP_DOWNLOAD_PROGRESS_EVENT, { show: true, progress: 0 });
          } catch (error) {
            console.error('显示下载开始提示时出错:', error);
          }
        },
        downloadApkProgress: (percent: number, _contentLength: number, _bytesWritten: number) => {
          try {
            // 发送进度事件
            eventEmitter.emit(APP_DOWNLOAD_PROGRESS_EVENT, { show: true, progress: percent });

            // 每下载10%显示一次进度提示
            if (percent % 10 === 0) {
              ToastAndroid.show(`下载进度: ${percent}%`, ToastAndroid.SHORT);
            }
          } catch (error) {
            console.error('显示下载进度时出错:', error);
          }
        },
        downloadApkEnd: () => {
          try {
            // 重置下载状态
            this.isDownloading = false;
            eventEmitter.emit(APP_DOWNLOAD_COMPLETE_EVENT);
            // 发送进度事件（关闭进度条）
            eventEmitter.emit(APP_DOWNLOAD_PROGRESS_EVENT, { show: false });

            ToastAndroid.show('下载完成，准备安装，请允许安装权限', ToastAndroid.LONG);
          } catch (error) {
            console.error('显示下载完成提示时出错:', error);
          }
        },
      });
    } catch (error) {
      console.error('初始化更新管理器失败:', error);
    }
  }

  // 检查应用更新
  checkUpdate(): void {
    if (!isAndroid()) {
      return;
    }

    try {
      if (!this.updateAPK) {
        return;
      }
      ToastAndroid.show('正在检查更新...', ToastAndroid.SHORT);
      this.updateAPK.checkUpdate();
    } catch (error) {
      ToastAndroid.show('检查更新失败', ToastAndroid.SHORT);
    }
  }

  // 检查是否正在下载
  isDownloadingUpdate(): boolean {
    return this.isDownloading;
  }
}

export default new UpdateManager();
