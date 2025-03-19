/**
 * 游戏组件属性类型
 */
export interface GameProps {
  route?: any;
  navigation?: any;
}
// 定义选择类型
export enum BetChoice {
  BANKER_WIN = 'banker_win',
  BANKER_LOSE = 'banker_lose',
  PLAYER_WIN = 'player_win',
  PLAYER_LOSE = 'player_lose',
}
export const BetChoiceMap = {
  [BetChoice.BANKER_WIN]: '庄赢',
  [BetChoice.BANKER_LOSE]: '庄输',
  [BetChoice.PLAYER_WIN]: '闲赢',
  [BetChoice.PLAYER_LOSE]: '闲输',
};
/**
 * 历史记录项类型
 */
export interface HistoryRecord {
  id: number;
  time: string;
  result: string;
  round: number;
  gameNumber: number;
  isWin: boolean;
  choice?: 'banker_win' | 'banker_lose' | 'player_win' | 'player_lose' | null;
}

/**
 * 轮次统计数据类型
 */
export interface RoundStats {
  round: number;
  wins: number;
  losses: number;
  betAmount: number;
  gamesPlayed: number;
  maxGames: number;
  isFirstRound: boolean;
  isFirstRoundAgain: boolean;
  consecutiveLosses: number;
}
