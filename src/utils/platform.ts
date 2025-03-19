import { Platform, StatusBar } from 'react-native';

/**
 * 获取状态栏高度
 * @returns {number} 状态栏高度
 */
export const getStatusBarHeight = (): number => {
  return Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
};

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
