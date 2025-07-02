import { DDRoundStats } from '../types/DDtypes';
import { GameRoundDto } from '../../../interface/Game';

/**
 * 获取初始轮次状态
 * @returns {DDRoundStats} DD初始轮次状态
 */
export const getDDInitialRoundStats = (initialBetAmount: number): DDRoundStats => {
  return {
    round: 1,
    wins: 0,
    losses: 0,
    betAmount: initialBetAmount,
    gamesPlayed: 0,
    maxGames: Infinity,
    roundProfitStr: '0',
    roundTurnOverStr: '0',
    challengeProfitStr: '0',
    challengeTurnOverStr: '0',
  };
};

/**
 * 根据历史记录计算并更新游戏统计数据
 * @param roundData 游戏轮次数据
 * @returns 更新后的游戏统计数据
 */
export const updateDDGameStats = (roundData: GameRoundDto): DDRoundStats => {
  // 初始化游戏统计数据
  const stats: DDRoundStats = getDDInitialRoundStats(0);

  if (!roundData?.gamePointDtoList?.length) {
    return stats;
  }

  // 记录最后一轮的数据
  let wins = 0;
  let losses = 0;

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
        } else {
          losses++;
        }
      });
    }
  });

  // 更新游戏统计数据
  stats.round = lastRound;
  stats.wins = wins;
  stats.losses = losses;
  stats.gamesPlayed = wins + losses;

  // 获取当前轮次的押注金额
  const currentRoundData = roundData.gamePointDtoList.find((p) => p.eventNum === lastRound);
  stats.betAmount = currentRoundData?.betNumber || -1;
  stats.maxGames = Infinity;
  stats.roundProfitStr = roundData.profitStr;
  stats.roundTurnOverStr = roundData.turnOverStr;
  stats.challengeProfitStr = roundData.totalProfitStr;
  stats.challengeTurnOverStr = roundData.totalTurnOverStr;

  return stats;
};
