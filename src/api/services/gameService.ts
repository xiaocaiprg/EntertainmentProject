import { getToken } from './authService';

// 游戏历史记录类型
export interface GameHistory {
  id: string;
  gameName: string;
  date: string;
  result: string;
  amount: number;
}

// 模拟游戏历史记录
const mockGameHistory: GameHistory[] = [
  {
    id: '1',
    gameName: '21点',
    date: '2023-03-19',
    result: '胜利',
    amount: 100,
  },
  {
    id: '2',
    gameName: '骰宝',
    date: '2023-03-18',
    result: '失败',
    amount: -50,
  },
];

// 获取游戏历史记录
export const getGameHistory = async (): Promise<GameHistory[]> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 700));

  // 检查是否已登录
  if (!getToken()) {
    throw new Error('未登录');
  }

  // 获取用户的游戏历史记录
  const history = mockGameHistory || [];

  return history;
};

// 保存游戏记录
export const saveGameRecord = async (userId: string, gameData: Omit<GameHistory, 'id'>): Promise<GameHistory> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 检查是否已登录
  if (!getToken()) {
    throw new Error('未登录');
  }

  // 创建新游戏记录
  const newRecord: GameHistory = {
    id: Math.random().toString(36).substring(2),
    ...gameData,
  };

  return newRecord;
};
