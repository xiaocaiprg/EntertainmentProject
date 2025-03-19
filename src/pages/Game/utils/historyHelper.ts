import { HistoryRecord } from '../components/types';
import { BetChoice } from '../hooks/useGameLogic';

/**
 * 按轮次分组历史记录
 * @param {HistoryRecord[]} records 历史记录列表
 * @returns {Record<string, HistoryRecord[]>} 分组后的历史记录
 */
export const groupHistoryByRound = (records: HistoryRecord[]): Record<string, HistoryRecord[]> => {
  // 如果没有记录，返回空对象
  if (!records || records.length === 0) {
    return {};
  }

  const grouped: Record<string, HistoryRecord[]> = {};

  try {
    // 首先按轮次分组
    records.forEach((record) => {
      if (!record || record.round === undefined || record.round === null) {
        return;
      }

      const roundKey = `第${record.round}轮`;
      if (!grouped[roundKey]) {
        grouped[roundKey] = [];
      }
      grouped[roundKey].push(record);
    });

    // 对每一轮内的记录按照gameNumber排序
    Object.keys(grouped).forEach((roundKey) => {
      grouped[roundKey].sort((a, b) => a.gameNumber - b.gameNumber);
    });

    // 对轮次键进行排序（按照轮次数字从大到小排序，最新的轮次显示在前面）
    const sortedGrouped: Record<string, HistoryRecord[]> = {};
    Object.keys(grouped)
      .sort((a, b) => {
        // 提取轮次数字进行比较，"第X轮" => X
        const roundA = parseInt(a.replace(/[^0-9]/g, ''), 10);
        const roundB = parseInt(b.replace(/[^0-9]/g, ''), 10);
        return roundB - roundA; // 从大到小排序
      })
      .forEach((key) => {
        sortedGrouped[key] = grouped[key];
      });

    return sortedGrouped;
  } catch (error) {
    return {};
  }
};

/**
 * 获取结果描述文本
 * @param {BetChoice} choice 选择的结果
 * @returns {string} 结果描述文本
 */
export const getResultText = (choice: BetChoice): string => {
  switch (choice) {
    case 'banker_win':
      return '庄赢';
    case 'banker_lose':
      return '庄输';
    case 'player_win':
      return '闲赢';
    case 'player_lose':
      return '闲输';
    default:
      return '未知';
  }
};

/**
 * 创建新的历史记录
 * @param {BetChoice} choice 选择的结果
 * @param {number} betAmount 押注金额
 * @param {number} round 轮次
 * @param {number} gameNumber 游戏次数
 * @returns {HistoryRecord} 新的历史记录
 */
export const createHistoryRecord = (
  choice: BetChoice,
  betAmount: number,
  round: number,
  gameNumber: number,
): HistoryRecord => {
  // 根据选择确定是否赢局
  const isWin = choice === 'banker_win' || choice === 'player_win';

  // 获取结果文本
  const resultText = getResultText(choice);

  // 胜局显示押注金额，负局显示负的押注金额
  const displayBetAmount = isWin ? betAmount : -betAmount;

  const record = {
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    result: resultText,
    betAmount: displayBetAmount,
    round,
    gameNumber,
    isWin,
    choice: choice,
  };

  return record;
};
