/**
 * 游戏组件属性类型
 */
export interface GameProps {
  route?: any;
  navigation?: any;
}
// 定义选择类型
export type BetChoice = 'banker_win' | 'banker_lose' | 'player_win' | 'player_lose' | null;

/**
 * 历史记录项类型
 */
export interface HistoryRecord {
  id: number;
  time: string;
  result: string;
  betAmount: number;
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
