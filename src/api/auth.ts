import { setToken, clearToken } from './client';

// 用户类型
export interface User {
  id: string;
  username: string;
  avatar?: string;
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    avatar: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    username: 'user',
    avatar: 'https://via.placeholder.com/150',
  },
];

// 模拟登录API
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

// 模拟注册API
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

// 模拟登出API
export const logout = async (): Promise<void> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 清除token
  clearToken();
};
