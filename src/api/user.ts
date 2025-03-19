import { User } from './auth';

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

// 模拟获取当前用户信息API
export const getCurrentUser = async (): Promise<User> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 模拟成功响应
  // 在实际应用中，这里应该是通过token获取用户信息
  // 这里简单返回第一个用户
  return mockUsers[0];
};

// 模拟获取用户信息API
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

// 模拟更新用户信息API
export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<User> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800));

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
