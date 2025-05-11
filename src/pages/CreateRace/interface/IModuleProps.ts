export interface FormData {
  name: string;
  description: string;
  beginDate: Date;
  endDate: Date;
  playRuleCode: string;
  turnOverLimit: string;
}

// 定义挑战类型枚举
export enum ChallengeType {
  NO_PROFIT_LIMIT = 'CB', // 无止盈过关
  EVEN_BET = 'AA', // 平注
  // 这里可以添加更多的挑战类型
}
