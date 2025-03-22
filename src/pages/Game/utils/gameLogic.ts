import { RoundStats } from '../types';
import { GameRoundDto } from '../../../interface/Game';

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
    maxGames: Infinity,
    isFirstRound: true,
    isFirstRoundAgain: false,
    consecutiveLosses: 0,
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
    // 再次进入初始轮：净胜1局或净胜3局进入下一轮
    return stats.gamesPlayed >= 2 && stats.gamesPlayed <= 3 && (netWins === 1 || netWins === 3);
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
    // 再次进入初始轮：净负1局或连续负2局则结束
    return (netLosses === 1 || stats.consecutiveLosses === 2) && stats.gamesPlayed >= 2 && stats.gamesPlayed <= 3;
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
    return INITIAL_BET_AMOUNT + 2000;
  } else if (stats.isFirstRoundAgain) {
    // 再次进入初始轮的押注规则
    const netWins = stats.wins - stats.losses;
    if (netWins === 3) {
      // 净胜3局，押注增加2000
      return stats.betAmount + 2000;
    } else if (netWins === 1) {
      // 净胜1局，押注增加1000
      return stats.betAmount + 1000;
    }
    return stats.betAmount;
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
 * 检查是否是再次进入初始轮
 * @param {number} betAmount 当前轮次的押注金额
 * @param {number} nextBetAmount 下一轮的押注金额
 * @param {boolean} isFirstRound 是否是第一轮
 * @param {number} round 当前轮次
 * @returns {boolean} 是否再次进入初始轮
 */
export const isAgainInitRound = (
  betAmount: number,
  nextBetAmount: number,
  isFirstRound: boolean,
  round: number,
): boolean => {
  if (isFirstRound) {
    return false;
  }
  return nextBetAmount === INITIAL_BET_AMOUNT && round > 1;
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
  // 再次进入初始轮：最少2局，最多3局
  if (stats.isFirstRoundAgain) {
    const netWins = stats.wins - stats.losses;
    const netLosses = stats.losses - stats.wins;

    // 已经玩了2-3局，并且符合结算条件之一：净胜1局/净胜3局/净负1局/连续负2局
    return (
      stats.gamesPlayed >= 2 &&
      stats.gamesPlayed <= 3 &&
      (netWins === 1 || netWins === 3 || netLosses === 1 || stats.consecutiveLosses === 2)
    );
  }
  // 非初始轮：必须玩满3局才能结算
  return stats.gamesPlayed === 3;
};

/**
 * 根据历史记录计算并更新游戏统计数据
 * @param roundData 游戏轮次数据
 * @returns 更新后的游戏统计数据
 */
export const updateGameStats = (roundData: GameRoundDto): RoundStats => {
  // 初始化游戏统计数据
  const stats: RoundStats = getInitialRoundStats();

  if (!roundData?.gamePointDtoList?.length) {
    return stats;
  }

  // 记录最后一轮的数据
  let wins = 0;
  let losses = 0;
  let consecutiveLosses = 0;
  let lastIsWin = true; // 用于跟踪连续输

  // 找出最后一轮的数据
  const lastRound = roundData.gamePointDtoList[roundData.gamePointDtoList.length - 1]?.eventNum || 1;

  // 统计最后一轮的胜负情况
  roundData.gamePointDtoList.forEach((pointDto) => {
    const round = pointDto.eventNum || 0;
    if (round === lastRound && pointDto.gameInningDtoList?.length) {
      pointDto.gameInningDtoList.forEach((inning) => {
        // 判断是否赢
        const isWin = inning.result === 1;
        if (isWin) {
          wins++;
          lastIsWin = true;
          consecutiveLosses = 0;
        } else {
          losses++;
          if (!lastIsWin) {
            consecutiveLosses++;
          }
          lastIsWin = false;
        }
      });
    }
  });
  // 更新游戏统计数据
  stats.round = lastRound;
  stats.wins = wins;
  stats.losses = losses;
  stats.gamesPlayed = wins + losses;
  stats.consecutiveLosses = consecutiveLosses;

  // 获取当前轮次的押注金额
  const currentRoundData = roundData.gamePointDtoList.find((p) => p.eventNum === lastRound);
  stats.betAmount = currentRoundData?.betNumber;

  // 根据轮次判断是否为初始轮
  stats.isFirstRound = lastRound === 1;
  stats.isFirstRoundAgain = stats.betAmount === 3000 && lastRound > 1;

  // 设置最大游戏次数
  if (stats.isFirstRound) {
    stats.maxGames = Infinity; // 初始轮无限制
  } else {
    stats.maxGames = 3; // 非初始轮最多3局
  }

  return stats;
};
