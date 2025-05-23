// 添加挑战状态枚举
export enum ChallengeStatus {
  ENDED = 0, // 已结束
  IN_PROGRESS = 1, // 进行中
  FUNDRAISING = 2, // 募资中
  FUNDRAISING_COMPLETED = 3, // 募资完成
  COMPLETED = 4, // 已完成
}

// 定义挑战类型枚举
export enum ChallengeType {
  NO_PROFIT_LIMIT = 'CB', // 无止盈过关
  EVEN_BET = 'AA', // 平注
  // 这里可以添加更多的挑战类型
}
export enum UserType {
  RECORDER = 1, // 记录人
  PLAYPERSON = 2, // 投手
  INVESTOR = 3, // 投资人
  OPERATIONPERSON = 4, // 运营人
}
export interface QueryParams {
  pageNum: number;
  pageSize: number;
}
