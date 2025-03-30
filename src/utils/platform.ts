import { Platform, StatusBar, Dimensions } from 'react-native';

/**
 * 获取状态栏高度
 * @returns {number} 状态栏高度
 */
const getStatusBarHeight = (): number => {
  return Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 28;
};
export const STATUS_BAR_HEIGHT = getStatusBarHeight();

/**
 * 获取当前设备的尺寸
 */
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * 判断当前平台是否为iOS
 * @returns {boolean} 是否为iOS平台
 */
export const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

/**
 * 判断当前平台是否为Android
 * @returns {boolean} 是否为Android平台
 */
export const isAndroid = (): boolean => {
  return Platform.OS === 'android';
};

/**
 * 获取页面头部高度（包含状态栏）
 * @param {number} headerHeight 页面头部高度（不含状态栏）
 * @returns {number} 总高度
 */
export const getHeaderTotalHeight = (headerHeight: number = 60): number => {
  return headerHeight + getStatusBarHeight();
};

/**
 * 获取当前设备方向
 * @returns {string} 'portrait' | 'landscape'
 */
export const getDeviceOrientation = (): 'portrait' | 'landscape' => {
  return SCREEN_HEIGHT > SCREEN_WIDTH ? 'portrait' : 'landscape';
};

/**
 * 格式化金额显示
 * @param {number} amount 金额
 * @param {string} currency 货币符号，默认为元
 * @returns {string} 格式化后的金额字符串
 */
export const formatAmount = (amount: number, currency: string = '元'): string => {
  const absAmount = Math.abs(amount);
  const prefix = amount >= 0 ? '+' : '-';
  return `${prefix}${absAmount}${currency}`;
};
