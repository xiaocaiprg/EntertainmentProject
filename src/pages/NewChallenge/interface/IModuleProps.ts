// 定义下拉框枚举类型
export enum DropdownType {
  NONE = 'none',
  OPERATOR = 'operator',
  LOCATION = 'location',
}

// 定义表单数据类型
export interface ChallengeFormData {
  operatorCode: string; // 投手编码
  locationId: number; // 地点ID
  name: string; // 挑战名称
  date: Date; // 日期
  principal: string; // 本金
  contriAmount: string; // 出资额度
}
