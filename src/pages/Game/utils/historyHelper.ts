import { HistoryRecord, BetChoice, BetChoiceMap } from '../types';

/**
 * 生成当前时间字符串
 * @returns {string} 格式化的时间字符串
 */
export const getCurrentTimeString = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * 创建新的历史记录
 * @param {number} id 记录ID
 * @param {number} round 轮次
 * @param {number} gameNumber 游戏编号
 * @param {BetChoice} choice 选择
 * @param {boolean} isWin 是否赢
 * @param {number} betAmount 押注金额
 * @returns {HistoryRecord} 历史记录对象
 */
export const createHistoryRecord = (
  id: number,
  round: number,
  gameNumber: number,
  choice: BetChoice,
  isWin: boolean,
  betAmount: number,
): HistoryRecord => {
  return {
    id,
    time: getCurrentTimeString(),
    result: isWin ? '赢' : '输',
    round,
    gameNumber,
    isWin,
    choice,
    betAmount,
  };
};

/**
 * 按轮次分组历史记录
 * @param {HistoryRecord[]} records 历史记录列表
 * @returns {Record<number, HistoryRecord[]>} 按轮次分组的历史记录
 */
export const groupRecordsByRound = (records: HistoryRecord[]): Record<number, HistoryRecord[]> => {
  return records.reduce((groups, record) => {
    const round = record.round;
    if (!groups[round]) {
      groups[round] = [];
    }
    groups[round].push(record);
    return groups;
  }, {} as Record<number, HistoryRecord[]>);
};

/**
 * 获取选择的显示文本
 * @param {BetChoice | undefined} choice 选择
 * @returns {string} 显示文本
 */
export const getChoiceDisplayText = (choice: BetChoice | undefined | null): string => {
  if (!choice) {
    return '未选择';
  }
  return BetChoiceMap[choice] || '未知选择';
};
