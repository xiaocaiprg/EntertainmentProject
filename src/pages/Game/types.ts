/**
 * 游戏组件属性类型
 */
export interface GameProps {
  route?: any;
  navigation?: any;
}

/**
 * 游戏路由参数类型
 */
export interface GameRouteParams {
  challengeName: string; // 挑战名称
  operator: string; // 操作员
  roundId: number; //场Id
  challengeId?: number; // 挑战ID（可选，仅在现有挑战时存在）
  isNewChallenge?: boolean; // 是否新挑战（可选）
}

// 定义选择类型
export enum BetChoice {
  BANKER_WIN = 'banker_win',
  BANKER_LOSE = 'banker_lose',
  PLAYER_WIN = 'player_win',
  PLAYER_LOSE = 'player_lose',
}
export const BetChoiceMap = {
  [BetChoice.BANKER_WIN]: '+(庄)',
  [BetChoice.BANKER_LOSE]: '-(庄)',
  [BetChoice.PLAYER_WIN]: '+(闲)',
  [BetChoice.PLAYER_LOSE]: '-(闲)',
};
export const BankerOrPlayerMap = {
  [BetChoice.BANKER_WIN]: 1, // 庄
  [BetChoice.BANKER_LOSE]: 1, // 庄
  [BetChoice.PLAYER_WIN]: 2, // 闲
  [BetChoice.PLAYER_LOSE]: 2, // 闲
};

/**
 * 下一轮信息类型
 */
export interface NextRoundInfo {
  currentRound: number;
  nextRound: number;
  nextBetAmount: number;
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

/**
 * 轮次统计数据类型
 */
export interface RoundStats {
  round: number; // 当前轮次
  wins: number; // 赢局数
  losses: number; // 输局数
  betAmount: number; // 当前押注金额
  gamesPlayed: number; // 已玩局数
  maxGames: number; // 初始轮无限制游戏次数
  isFirstRound: boolean; // 是否是第一轮
  isFirstRoundAgain: boolean; // 是否是再次进入初始轮
  consecutiveLosses: number; // 连续负局计数
  consecutiveDemotions: number; // 连续输的次数
  roundProfitStr: string; // 本场上下水字符串
  roundTurnOverStr: string; // 本场转码字符串
  challengeProfitStr: string; // 挑战上下水字符串
  challengeTurnOverStr: string; // 挑战转码字符串
}
