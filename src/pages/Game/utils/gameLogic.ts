import { RoundStats } from '../types';

// 初始押注金额
export const INITIAL_BET_AMOUNT = 3000;

/**
 * 获取初始轮次状态
 * @returns {RoundStats} 初始轮次状态
 */
export const getInitialRoundStats = (): RoundStats => {
  return {
    round: 1, // 当前轮次
    wins: 0,
    losses: 0,
    betAmount: INITIAL_BET_AMOUNT, // 当前押注金额
    gamesPlayed: 0, // 已玩局数
    maxGames: Infinity, // 初始轮无限制游戏次数
    isFirstRound: true, // 是否是第一轮
    isFirstRoundAgain: false, // 是否是第二次进入3k轮
    consecutiveLosses: 0, // 连续负局计数
  };
};

/**
 * 计算是否进入下一轮
 * @param {RoundStats} stats 当前轮次统计
 * @returns {boolean} 是否进入下一轮
 */
export const shouldAdvanceToNextRound = (stats: RoundStats): boolean => {
  const netWins = stats.wins - stats.losses; // 净胜局数
  if (stats.isFirstRound) {
    // 初始轮：净胜2局进入下一轮
    return netWins === 2;
  } else if (stats.isFirstRoundAgain) {
    // 第二次进入初始轮：必须玩满3局 && 净胜 才能进入下一轮
    return stats.gamesPlayed >= 3 && netWins > 0;
  } else {
    // 非初始轮（第二轮及以后）：必须玩满3局 && 至少赢一次 才能进入下一轮
    return stats.gamesPlayed === 3 && netWins !== -3;
  }
};

/**
 * 计算是否游戏结束
 * @param {RoundStats} stats 当前轮次统计
 * @returns {boolean} 是否游戏结束
 */
export const isGameOver = (stats: RoundStats): boolean => {
  const netLosses = stats.losses - stats.wins; // 净负局数
  if (stats.isFirstRound) {
    // 初始轮：净负5局本盘结束
    return netLosses === 5;
  } else if (stats.isFirstRoundAgain) {
    // 第二次进入3k轮：必须玩满3局，净负则结束
    return stats.gamesPlayed >= 3 && netLosses > 0;
  } else {
    // 非初始轮（第二轮及以后）：必须玩满3局，全输 才结束
    return stats.gamesPlayed === 3 && netLosses === 3;
  }
};

/**
 * 计算下一轮的押注金额
 * @param {RoundStats} stats 当前轮次统计
 * @returns {number} 下一轮的押注金额
 */
export const calculateNextRoundBetAmount = (stats: RoundStats): number => {
  if (stats.isFirstRound) {
    return INITIAL_BET_AMOUNT;
  } else {
    const netWins = stats.wins - stats.losses;
    const netLosses = stats.losses - stats.wins;
    // 非初始轮都必须玩满3局才能计算
    if (stats.gamesPlayed === 3) {
      if (netWins === 3) {
        // 净胜3局，押注增加2000
        return stats.betAmount + 2000;
      } else if (netWins === 1) {
        // 净胜1局，押注增加1000
        return stats.betAmount + 1000;
      } else if (netLosses === 1) {
        // 净负1局，押注减少1000
        return stats.betAmount - 1000;
      }
    }
    return stats.betAmount; // 未满3局不变
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
  return nextBetAmount === 3000 && round > 1 && betAmount !== 3000;
};

/**
 * 检查当前轮次是否可以结算
 * @param {RoundStats} stats 当前轮次统计
 * @returns {boolean} 是否可以结算
 */
export const canSettleRound = (stats: RoundStats): boolean => {
  // 初始轮：随时可以结算
  if (stats.isFirstRound) {
    return true;
  }
  // 非初始轮：必须玩满3局才能结算
  return stats.gamesPlayed >= 3;
};
