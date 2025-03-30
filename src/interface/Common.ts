// 添加挑战状态枚举
export enum ChallengeStatus {
  ENDED = 0, // 已结束
  IN_PROGRESS = 1, // 进行中
  FUNDRAISING = 2, // 募资中
  FUNDRAISING_COMPLETED = 3, // 募资完成
  COMPLETED = 4, // 已完成
}
// 添加
export enum UserType {
  RECORDER = 1, // 记录人
  OPERATOR = 2, // 投手
  INVESTOR = 3, // 投资人
  PITCHER = 4, // 运营人
}
