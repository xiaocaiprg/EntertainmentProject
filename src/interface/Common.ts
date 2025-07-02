// 添加挑战状态枚举
export enum ChallengeStatus {
  ENDED = 0, // 已结束
  IN_PROGRESS = 1, // 进行中
  FUNDRAISING = 2, // 募资中
  FUNDRAISING_COMPLETED = 3, // 募资完成
  COMPLETED = 4, // 已完成
}
export enum RoundStatus {
  ENDED = 0, // 已结束
  IN_PROGRESS = 1, // 进行中
}
// 定义挑战类型枚举
export enum ChallengeType {
  NO_PROFIT_LIMIT = 'CB', // 无止盈过关
  EVEN_BET = 'AA', // 平注
  FREE_FIGHT = 'DD', // 自由搏击
  // 这里可以添加更多的挑战类型
}
export enum UserType {
  RECORDER = 1, // 记录人
  PLAYPERSON = 2, // 投手
  INVESTOR = 3, // 投资人
  OPERATIONPERSON = 4, // 运营人
}
export enum IsInside {
  INSIDE = 1, // 内部
  OUTSIDE = 2, // 外部
}
export enum CompanyType {
  RECORD = 1, // 记录公司
  PLAY = 2, // 投手公司
  INVEST = 3, // 投资公司
  OPERATION = 4, // 运营公司
  MATCH = 5, // 赛事公司
}

// 募资方式枚举
export enum FundraisingType {
  PUBLIC = 1, // 公开募资
  TARGETED = 2, // 定向募资
}

export interface QueryParams {
  pageNum: number;
  pageSize: number;
}
