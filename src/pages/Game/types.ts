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
  challengeName: string; // 挑战名称（必填）
  operator: string; // 操作员（必填）
  challengeId?: string; // 挑战ID（可选，仅在现有挑战时存在）
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
  [BetChoice.BANKER_WIN]: '庄赢',
  [BetChoice.BANKER_LOSE]: '庄输',
  [BetChoice.PLAYER_WIN]: '闲赢',
  [BetChoice.PLAYER_LOSE]: '闲输',
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
