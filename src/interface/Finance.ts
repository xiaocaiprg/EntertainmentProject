// 活期状态枚举
export enum InterestStatus {
  DISABLED = 0, // 关闭
  ENABLED = 1, // 开启
}
// 账户类型枚举
export enum AccountType {
  PERSON = 1, // 个人
  COMPANY = 2, // 公司
  BONUS_POOL = 3, // 奖金池
  GROUP = 4, // 集团
  PERSON_FIXED = 5, // 个人定存
  COMPANY_FIXED = 6, // 公司定存
}

// 利息开关类型枚举
export enum InterestSwitchType {
  CURRENT = 1, // 活期开关
  FIXED = 2, // 定期开关
}

export interface SwitchFinanceParams {
  code: string;
  userType: AccountType;
  interestSwitchType: InterestSwitchType;
  interestRate?: number;
  isEnabled: InterestStatus;
}
