import { Dimensions } from 'react-native';

// 获取屏幕尺寸
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * 应用主题颜色
 */
export const THEME_COLORS = {
  primary: '#6c5ce7',
  primaryDark: '#5b4ddb',
  secondary: '#3498db',
  background: '#fff',
  cardBackground: '#ffffff',
  success: '#2ecc71',
  danger: '#e74c3c',
  warning: '#f39c12',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#999999',
  },
  border: {
    light: '#eee',
    medium: '#ddd',
  },
};

/**
 * 通用阴影样式
 */
export const SHADOW_STYLE = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 2,
};

/**
 * 获取宽度百分比
 * @param {number} percentage 百分比 (0-100)
 * @returns {number} 屏幕宽度的百分比
 */
export const getWidthPercentage = (percentage: number): number => {
  return (percentage / 100) * SCREEN_WIDTH;
};

/**
 * 获取高度百分比
 * @param {number} percentage 百分比 (0-100)
 * @returns {number} 屏幕高度的百分比
 */
export const getHeightPercentage = (percentage: number): number => {
  return (percentage / 100) * SCREEN_HEIGHT;
};
