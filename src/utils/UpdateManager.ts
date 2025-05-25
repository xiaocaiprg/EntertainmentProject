import { Alert, ToastAndroid } from 'react-native';
import { UpdateAPK } from 'rn-update-apk';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import { eventEmitter } from '../utils/eventEmitter';
import { isAndroid } from './platform';

export const APP_DOWNLOADING_EVENT = 'app_downloading_event';
export const APP_DOWNLOAD_COMPLETE_EVENT = 'app_download_complete_event';
export const APP_DOWNLOAD_PROGRESS_EVENT = 'app_download_progress_event';
export const APP_VERSION_URL = 'https://junlongpro.com/image/apk_version.json';

class UpdateManager {
  private updateAPK: UpdateAPK | null = null;
  private isDownloading: boolean = false;
  private currentVersionCode: number = 0;
  private currentVersionName: string = '';

  constructor() {
    if (!isAndroid()) {
      return;
    }

    this.currentVersionCode = parseInt(DeviceInfo.getBuildNumber());
    this.currentVersionName = DeviceInfo.getVersion();
    try {
      const downloadDir = RNFS.CachesDirectoryPath;
      console.log('下载目录:', downloadDir);

      this.updateAPK = new UpdateAPK({
        apkVersionUrl: APP_VERSION_URL,
        fileProviderAuthority: 'com.entertainmentproject.provider',
        downloadDestDirectory: downloadDir,
        needUpdateApp: (confirmUpdate: (isUpdate: boolean) => void) => {
          try {
            Alert.alert(
              '发现新版本',
              `当前版本: ${this.currentVersionName}\n是否立即更新到最新版本？`,
              [
                {
                  text: '取消',
                  onPress: () => {
                    confirmUpdate(false);
                    ToastAndroid.show('已取消更新', ToastAndroid.SHORT);
                  },
                  style: 'cancel',
                },
                {
                  text: '更新',
                  onPress: () => {
                    this.isDownloading = true;
                    eventEmitter.emit(APP_DOWNLOADING_EVENT);
                    ToastAndroid.show('开始下载更新', ToastAndroid.SHORT);
                    confirmUpdate(true);
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
          this.isDownloading = false;
          eventEmitter.emit(APP_DOWNLOAD_COMPLETE_EVENT);
          eventEmitter.emit(APP_DOWNLOAD_PROGRESS_EVENT, { show: false });

          Alert.alert('更新失败', '应用更新失败，请稍后重试。如果持续失败，请手动下载安装。', [
            { text: '确定', onPress: () => {} },
          ]);
        },
        downloadApkStart: () => {
          ToastAndroid.show('正在后台下载更新，请稍候...', ToastAndroid.LONG);
          eventEmitter.emit(APP_DOWNLOAD_PROGRESS_EVENT, { show: true, progress: 0 });
        },
        downloadApkProgress: (percent: number) => {
          eventEmitter.emit(APP_DOWNLOAD_PROGRESS_EVENT, { show: true, progress: percent });
          if (percent % 10 === 0) {
            ToastAndroid.show(`下载进度: ${percent}%`, ToastAndroid.SHORT);
          }
        },
        downloadApkEnd: () => {
          this.isDownloading = false;
          eventEmitter.emit(APP_DOWNLOAD_COMPLETE_EVENT);
          eventEmitter.emit(APP_DOWNLOAD_PROGRESS_EVENT, { show: false });
          ToastAndroid.show('下载完成，准备安装，请允许安装权限', ToastAndroid.LONG);
        },
      });
    } catch (error) {
      console.error('初始化更新管理器失败:', error);
    }
  }

  // 检查版本信息
  async checkVersionInfo(): Promise<{
    hasUpdate: boolean;
    currentVersion: string;
    remoteVersion?: string;
    error?: string;
  }> {
    if (!isAndroid()) {
      return { hasUpdate: false, currentVersion: this.currentVersionName, error: '仅支持Android平台' };
    }
    try {
      const response = await fetch(`${APP_VERSION_URL}?t=${Date.now()}`);
      const json = await response.json();
      const remoteVersionCode = parseInt(json.versionCode);
      const remoteVersionName = json.versionName || json.versionCode;
      return {
        hasUpdate: remoteVersionCode > this.currentVersionCode,
        currentVersion: this.currentVersionName,
        remoteVersion: remoteVersionName,
      };
    } catch (error) {
      return { hasUpdate: false, currentVersion: this.currentVersionName, error: '检查更新失败' };
    }
  }

  // 主动检查更新（带版本号判断）
  checkUpdate(): void {
    if (!isAndroid() || !this.updateAPK) {
      return;
    }

    fetch(`${APP_VERSION_URL}?t=${Date.now()}`)
      .then((res) => res.json())
      .then((json) => {
        const remoteVersionCode = parseInt(json.versionCode);
        console.log(`当前版本: ${this.currentVersionCode}, 远程版本: ${remoteVersionCode}`);
        if (remoteVersionCode > this.currentVersionCode) {
          this.updateAPK?.checkUpdate(); // 正常触发更新流程
        }
      })
      .catch((err) => {
        console.error('获取版本信息失败:', err);
        ToastAndroid.show('检查更新失败', ToastAndroid.SHORT);
      });
  }

  isDownloadingUpdate(): boolean {
    return this.isDownloading;
  }
}

export default new UpdateManager();
