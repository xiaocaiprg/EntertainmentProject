import AsyncStorage from '@react-native-async-storage/async-storage';

// Token相关常量
export const TOKEN_KEY = 'Authorization';

// 内存缓存，用于提高性能，避免频繁的异步访问
const memoryCache: Record<string, string> = {};

// 初始化缓存，从持久存储加载数据
const initCache = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      memoryCache[TOKEN_KEY] = token;
    }
  } catch (error) {
    console.error('初始化缓存失败:', error);
  }
};

// 应用启动时初始化缓存
initCache();

// 存储Token - 异步API
export const setToken = async (token: string): Promise<void> => {
  try {
    // 更新内存缓存
    memoryCache[TOKEN_KEY] = token;
    // 持久化到AsyncStorage
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('存储Token失败:', error);
  }
};

// 存储Token - 同步API (使用内存缓存)
export const setTokenSync = (token: string): void => {
  memoryCache[TOKEN_KEY] = token;
  // 后台异步保存，不等待完成
  AsyncStorage.setItem(TOKEN_KEY, token).catch((error) => console.error('异步存储Token失败:', error));
};

// 获取Token - 异步API (从AsyncStorage获取最新值)
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      // 更新内存缓存
      memoryCache[TOKEN_KEY] = token;
    }
    return token;
  } catch (error) {
    console.error('获取Token失败:', error);
    return null;
  }
};

// 获取Token - 同步API (从内存缓存获取)
export const getTokenSync = (): string | null => {
  return memoryCache[TOKEN_KEY] || null;
};

// 清除Token - 异步API
export const clearToken = async (): Promise<void> => {
  try {
    // 清除内存缓存
    delete memoryCache[TOKEN_KEY];
    // 从AsyncStorage中移除
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('清除Token失败:', error);
  }
};

// 清除Token - 同步API
export const clearTokenSync = (): void => {
  delete memoryCache[TOKEN_KEY];
  // 后台异步删除
  AsyncStorage.removeItem(TOKEN_KEY).catch((error) => console.error('异步清除Token失败:', error));
};

// 通用存储方法 - 异步API
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    memoryCache[key] = value;
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(`存储${key}失败:`, error);
  }
};

// 通用存储方法 - 同步API
export const setItemSync = (key: string, value: string): void => {
  memoryCache[key] = value;
  AsyncStorage.setItem(key, value).catch((error) => console.error(`异步存储${key}失败:`, error));
};

// 获取项 - 异步API
export const getItem = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      memoryCache[key] = value;
    }
    return value;
  } catch (error) {
    console.error(`获取${key}失败:`, error);
    return null;
  }
};

// 获取项 - 同步API
export const getItemSync = (key: string): string | null => {
  return memoryCache[key] || null;
};

// 移除项 - 异步API
export const removeItem = async (key: string): Promise<void> => {
  try {
    delete memoryCache[key];
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`删除${key}失败:`, error);
  }
};

// 移除项 - 同步API
export const removeItemSync = (key: string): void => {
  delete memoryCache[key];
  AsyncStorage.removeItem(key).catch((error) => console.error(`异步删除${key}失败:`, error));
};

// 清除所有 - 异步API
export const clearAll = async (): Promise<void> => {
  try {
    // 清除内存缓存
    Object.keys(memoryCache).forEach((key) => delete memoryCache[key]);
    // 清除AsyncStorage
    await AsyncStorage.clear();
  } catch (error) {
    console.error('清除所有存储失败:', error);
  }
};

// 清除所有 - 同步API
export const clearAllSync = (): void => {
  Object.keys(memoryCache).forEach((key) => delete memoryCache[key]);
  AsyncStorage.clear().catch((error) => console.error('异步清除所有存储失败:', error));
};

// 支持存储对象 - 异步API
export const setObject = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    memoryCache[key] = jsonValue;
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`存储对象${key}失败:`, error);
  }
};

// 支持存储对象 - 同步API
export const setObjectSync = <T>(key: string, value: T): void => {
  try {
    const jsonValue = JSON.stringify(value);
    memoryCache[key] = jsonValue;
    AsyncStorage.setItem(key, jsonValue).catch((error) => console.error(`异步存储对象${key}失败:`, error));
  } catch (error) {
    console.error(`序列化对象${key}失败:`, error);
  }
};

// 获取对象 - 异步API
export const getObject = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue) {
      memoryCache[key] = jsonValue;
      return JSON.parse(jsonValue) as T;
    }
    return null;
  } catch (error) {
    console.error(`获取对象${key}失败:`, error);
    return null;
  }
};

// 获取对象 - 同步API
export const getObjectSync = <T>(key: string): T | null => {
  const value = memoryCache[key];
  if (value) {
    try {
      return JSON.parse(value) as T;
    } catch (e) {
      console.error(`解析对象${key}失败:`, e);
      return null;
    }
  }
  return null;
};

// 获取所有存储的数据，todo删除
const getAllStoredData = async () => {
  try {
    // 获取所有存储的 key
    const keys = await AsyncStorage.getAllKeys();

    if (keys.length > 0) {
      // 获取所有 key 对应的值
      const stores = await AsyncStorage.multiGet(keys);

      // 转换为对象格式方便查看
      const result = stores.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

      console.log('Stored Data:', result);
    } else {
      console.log('No stored data found.');
    }
  } catch (error) {
    console.error('Error fetching all stored data:', error);
  }
};

getAllStoredData();
