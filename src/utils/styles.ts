import { Dimensions, StyleSheet } from 'react-native';

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
  disabled: '#cccccc',
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
 * 通用阴影样式 - 修改为纯边框样式，解决Android阴影问题
 */
export const SHADOW_STYLE = {
  borderWidth: 1,
  borderColor: '#e0e0e0',
  borderRadius: 8,
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

/**
 * 合并样式函数
 * 将自定义样式与默认样式合并
 * @param defaultStyles 默认样式对象
 * @param customStyles 自定义样式对象
 * @returns 返回一个对象，其中包含所有合并后的样式
 */
export const mergeStyles = <T extends Record<string, any>>(
  defaultStyles: T,
  customStyles?: Partial<{ [K in keyof T]: any }>,
): { [K in keyof T]: any } => {
  if (!customStyles) {
    return defaultStyles;
  }

  const mergedStyles: any = { ...defaultStyles };

  Object.keys(customStyles).forEach((key) => {
    const styleKey = key as keyof T;
    if (styleKey in defaultStyles && customStyles[styleKey]) {
      mergedStyles[styleKey] = StyleSheet.compose(defaultStyles[styleKey], customStyles[styleKey]);
    }
  });

  return mergedStyles;
};
