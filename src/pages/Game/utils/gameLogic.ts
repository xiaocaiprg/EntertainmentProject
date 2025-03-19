import { RoundStats } from '../components/types';

// 初始押注金额
export const INITIAL_BET_AMOUNT = 3000;

/**
 * 获取初始轮次状态
 * @returns {RoundStats} 初始轮次状态
 */
export const getInitialRoundStats = (): RoundStats => {
  return {
    round: 1,
    wins: 0,
    losses: 0,
    betAmount: INITIAL_BET_AMOUNT,
    gamesPlayed: 0,
    maxGames: Infinity, // 初始轮无限制游戏次数
    isFirstRound: true,
    is3kRoundAgain: false, // 是否是第二次进入3k轮
    consecutiveLosses: 0, // 连续负局计数
  };
};

/**
 * 计算是否进入下一轮
 * @param {RoundStats} stats 当前轮次统计
 * @returns {boolean} 是否进入下一轮
 */
export const shouldAdvanceToNextRound = (stats: RoundStats): boolean => {
  if (stats.isFirstRound) {
    // 初始轮：净胜2局进入下一轮
    return stats.wins - stats.losses >= 2;
  } else if (stats.is3kRoundAgain) {
    // 第二次进入3k轮：净胜1局或3局都进入下一轮
    const netWins = stats.wins - stats.losses;
    return netWins >= 1;
  } else {
    // 非初始轮（第二轮及以后）：净胜1局或3局都进入下一轮
    const netWins = stats.wins - stats.losses;
    return netWins >= 1;
  }
};

/**
 * 计算是否游戏结束
 * @param {RoundStats} stats 当前轮次统计
 * @returns {boolean} 是否游戏结束
 */
export const isGameOver = (stats: RoundStats): boolean => {
  if (stats.isFirstRound) {
    // 初始轮：净负5局本盘结束
    return stats.losses - stats.wins >= 5;
  } else if (stats.is3kRoundAgain) {
    // 第二次进入3k轮：净负1局或连续负2局本盘结束
    return stats.losses - stats.wins >= 1 || stats.consecutiveLosses >= 2;
  } else {
    // 非初始轮（第二轮及以后）：净负3局或净负1局降级至3000元轮
    const netLosses = stats.losses - stats.wins;
    if (netLosses >= 3) {
      return true; // 净负3局直接结束游戏
    } else if (netLosses >= 1) {
      // 净负1局降级，如果降级后是3000元，并且之前来过3000元，则判断是否已经是第二次3k轮
      const nextBetAmount = Math.max(1000, stats.betAmount - 1000);
      return nextBetAmount === 3000 && stats.round > 2; // 如果降级到3000元，且已经不是第一轮或第二轮，则是第二次进入3k轮
    }
    return false;
  }
};

/**
 * 计算下一轮的押注金额
 * @param {RoundStats} stats 当前轮次统计
 * @returns {number} 下一轮的押注金额
 */
export const calculateNextRoundBetAmount = (stats: RoundStats): number => {
  if (stats.isFirstRound) {
    // 初始轮到第二轮的押注金额固定为3000元
    return INITIAL_BET_AMOUNT;
  } else {
    const netWins = stats.wins - stats.losses;
    const netLosses = stats.losses - stats.wins;

    if (netWins >= 3) {
      // 净胜3局，押注增加2000
      return stats.betAmount + 2000;
    } else if (netWins >= 1) {
      // 净胜1局，押注增加1000
      return stats.betAmount + 1000;
    } else if (netLosses >= 1) {
      // 净负1局，押注减少1000，但最低为1000元
      return Math.max(1000, stats.betAmount - 1000);
    } else {
      // 平局，押注不变
      return stats.betAmount;
    }
  }
};

/**
 * 检查是否是第二次进入3k轮
 * @param {number} betAmount 当前轮次的押注金额
 * @param {number} nextBetAmount 下一轮的押注金额
 * @param {boolean} isFirstRound 是否是第一轮
 * @param {number} round 当前轮次
 * @returns {boolean} 是否是第二次进入3k轮
 */
export const isSecond3kRound = (
  betAmount: number,
  nextBetAmount: number,
  isFirstRound: boolean,
  round: number,
): boolean => {
  // 如果是从初始轮过来的，肯定不是第二次进入3k轮
  if (isFirstRound) {
    return false;
  }

  // 如果下一轮押注金额是3000，且当前不是第一轮或第二轮，则是第二次进入3k轮
  return nextBetAmount === 3000 && round > 2 && betAmount !== 3000;
};

/**
 * 更新连续负局计数
 * @param {boolean} isWin 是否赢局
 * @param {number} currentConsecutiveLosses 当前连续负局数
 * @returns {number} 更新后的连续负局数
 */
export const updateConsecutiveLosses = (isWin: boolean, currentConsecutiveLosses: number): number => {
  if (isWin) {
    return 0; // 如果赢了，重置连续负局计数
  } else {
    return currentConsecutiveLosses + 1; // 如果输了，增加连续负局计数
  }
};
