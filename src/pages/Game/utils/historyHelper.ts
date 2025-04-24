import { HistoryRecord } from '../types/CBtypes';
import { BetChoice, BetChoiceMap } from '../types/common';
import { GameInningDto, GamePointDto, GameRoundDto } from '../../../interface/Game';

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
 * 将GamePointDto转换为HistoryRecord的函数
 * @param roundData 游戏轮次数据
 * @returns 转换后的历史记录列表
 */
export const convertToHistoryRecords = (roundData: GameRoundDto): HistoryRecord[] => {
  const allRecords: HistoryRecord[] = [];
  if (!roundData?.gamePointDtoList?.length) {
    return allRecords;
  }
  // 遍历每个游戏点数据（每个点代表一轮）
  roundData.gamePointDtoList.forEach((pointDto: GamePointDto, roundIndex: number) => {
    const round = pointDto.eventNum || roundIndex + 1;
    // 如果有局数据，则遍历每一局创建记录
    if (pointDto.gameInningDtoList?.length) {
      pointDto.gameInningDtoList.forEach((inning: GameInningDto, inningIndex: number) => {
        let choice: BetChoice | undefined;
        let isWin = false;
        // 判断庄闲和输赢情况
        // isDealer: 1-庄家，2-闲家
        // result: 1-赢，2-输
        if (inning.isDealer === 1 && inning.result === 1) {
          choice = BetChoice.BANKER_WIN;
          isWin = true;
        } else if (inning.isDealer === 1 && inning.result === 2) {
          choice = BetChoice.BANKER_LOSE;
          isWin = false;
        } else if (inning.isDealer === 2 && inning.result === 1) {
          choice = BetChoice.PLAYER_WIN;
          isWin = true;
        } else if (inning.isDealer === 2 && inning.result === 2) {
          choice = BetChoice.PLAYER_LOSE;
          isWin = false;
        }
        // 创建历史记录对象
        allRecords.push({
          id: inning.id,
          time: inning.createTime || '', // 只显示时间部分
          result: isWin ? '赢' : '输',
          round: round, // 使用计算出的轮次
          gameNumber: inningIndex + 1, // 游戏局数，从1开始
          isWin,
          betAmount: pointDto.betNumber || 0, // 使用投注金额
          choice,
        });
      });
    }
  });

  return allRecords;
};

/**
 * 获取选择的显示文本
 * @param {BetChoice | undefined} choice 选择
 * @returns {string} 显示文本
 */
export const getChoiceDisplayText = (choice: BetChoice | undefined): string => {
  if (!choice) {
    return '未选择';
  }
  return BetChoiceMap[choice] || '未知选择';
};
