import { User } from '../../interface/IModuleProps';

// 内存中存储token
let memoryToken: string | null = null;

// 设置token
export const setToken = (token: string) => {
  memoryToken = token;
};

// 清除token
export const clearToken = () => {
  memoryToken = null;
};

// 获取token
export const getToken = (): string | null => {
  return memoryToken;
};

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    avatar: 'https://i.postimg.cc/s2033pJG/user.jpg',
  },
  {
    id: '2',
    username: 'user',
    avatar: 'https://i.postimg.cc/s2033pJG/user.jpg',
  },
];

// 登录
export const login = async (username: string, password: string): Promise<User> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 模拟验证
  if (username === 'admin' && password === 'admin123') {
    // 模拟成功响应
    const user = mockUsers[0];
    const token = 'mock-token-' + Math.random().toString(36).substring(2);

    // 保存token
    setToken(token);

    return user;
  } else if (username === 'user' && password === 'user123') {
    // 模拟成功响应
    const user = mockUsers[1];
    const token = 'mock-token-' + Math.random().toString(36).substring(2);

    // 保存token
    setToken(token);

    return user;
  } else {
    // 模拟失败响应
    throw new Error('用户名或密码错误');
  }
};

// 注册
export const register = async (username: string, _password: string): Promise<User> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 模拟验证
  if (mockUsers.some((user) => user.username === username)) {
    throw new Error('用户名已存在');
  }

  // 模拟成功响应
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    username,
    avatar: 'https://via.placeholder.com/150',
  };

  // 添加到模拟用户列表
  mockUsers.push(newUser);

  // 生成token
  const token = 'mock-token-' + Math.random().toString(36).substring(2);

  // 保存token
  setToken(token);

  return newUser;
};

// 登出
export const logout = async (): Promise<void> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 清除token
  clearToken();
};

// 检查登录状态
export const checkLoginStatus = async (): Promise<User | null> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 检查token是否存在
  if (!memoryToken) {
    return null;
  }

  // 在实际应用中，这里应该发送请求到服务器验证token
  // 这里简单返回第一个用户作为模拟
  return mockUsers[0];
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 检查是否已登录
  if (!memoryToken) {
    throw new Error('未登录');
  }

  // 模拟成功响应
  // 在实际应用中，这里应该是通过token获取用户信息
  return mockUsers[0];
};

// 获取用户信息
export const getUserById = async (userId: string): Promise<User> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 查找用户
  const user = mockUsers.find((user) => user.id === userId);

  if (!user) {
    throw new Error('用户不存在');
  }

  return user;
};

// 更新用户信息
export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<User> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 检查是否已登录
  if (!memoryToken) {
    throw new Error('未登录');
  }

  // 查找用户
  const userIndex = mockUsers.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    throw new Error('用户不存在');
  }

  // 更新用户信息
  const updatedUser = {
    ...mockUsers[userIndex],
    ...data,
  };

  // 保存到模拟数据
  mockUsers[userIndex] = updatedUser;

  return updatedUser;
};

// 检查登录态
export const isLoggedIn = (): boolean => {
  return !!memoryToken;
};
