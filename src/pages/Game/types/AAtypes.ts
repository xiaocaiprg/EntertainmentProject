import { BetChoice } from './common';
/**
 * 下一轮信息类型
 */
export interface NextRoundInfo {
  currentRound: number;
  nextRound: number;
  nextBetAmount: number;
}
/**
 * AA轮次统计数据类型
 */
export interface AARoundStats {
  round: number; // 当前轮次
  wins: number; // 赢局数
  losses: number; // 输局数
  betAmount: number; // 当前押注金额
  gamesPlayed: number; // 已玩局数
  maxGames: number; // 无限制游戏次数
  roundProfitStr: string; // 本场上下水字符串
  roundTurnOverStr: string; // 本场转码字符串
  challengeProfitStr: string; // 挑战上下水字符串
  challengeTurnOverStr: string; // 挑战转码字符串
}
/**
 * 游戏状态弹窗信息类型
 */
export interface GameStatusModalInfo {
  visible: boolean;
  isGameOver: boolean;
  title: string;
  confirmText: string;
  nextRoundInfo: NextRoundInfo | null;
  roundId?: number;
}
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
  betAmount: number;
  choice?: BetChoice;
}
