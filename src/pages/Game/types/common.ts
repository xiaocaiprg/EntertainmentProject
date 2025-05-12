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
  recorder: string; // 记录人
  roundId: number; //场Id
  baseNumber: number; // 基数
  challengeId?: number; // 挑战ID（可选，仅在现有挑战时存在）
  isNewChallenge?: boolean; // 是否新挑战（可选）
  playRuleCode: string; // 玩法代码
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
