import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en } from './locales/en';
import { zh } from './locales/zh';

// 语言资源
const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

// 默认语言
export const DEFAULT_LANGUAGE = 'zh';

// 初始化i18next
i18next.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

// 获取当前语言
export const getCurrentLanguage = async (): Promise<string> => {
  try {
    const language = await AsyncStorage.getItem('language');
    return language || DEFAULT_LANGUAGE;
  } catch (error) {
    console.error('获取语言设置失败:', error);
    return DEFAULT_LANGUAGE;
  }
};

// 设置语言
export const setLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('language', language);
    i18next.changeLanguage(language);
  } catch (error) {
    console.error('设置语言失败:', error);
  }
};

export default i18next;
