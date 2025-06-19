// 活期状态枚举
export enum InterestStatus {
  DISABLED = 0, // 关闭
  ENABLED = 1, // 开启
}

// 角色类型枚举
export enum RoleType {
  PERSON = 1, // 个人类型
  COMPANY = 2, // 公司类型
  GROUP = 3, // 集团类型
}

export interface SwitchFinanceParams {
  code: string;
  isEnabled: InterestStatus;
  roleType: RoleType;
}
