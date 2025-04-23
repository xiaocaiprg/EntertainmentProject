import { BASE_BET_AMOUNT } from '../../../constants/betAmounts';

// 定义下拉框枚举类型
export enum DropdownType {
  NONE = 'none',
  PLAYPERSON = 'operator',
  LOCATION = 'location',
  BET_AMOUNT = 'betAmount',
}

// 定义挑战类型枚举
export enum ChallengeType {
  NO_PROFIT_LIMIT = 'CB', // 无止盈过关
  EVEN_BET = 'AA', // 平注
  // 这里可以添加更多的挑战类型
}
export const BET_AMOUNT_OPTIONS = {
  [ChallengeType.NO_PROFIT_LIMIT]: [
    { label: BASE_BET_AMOUNT.THREE_THOUSAND.toString(), value: BASE_BET_AMOUNT.THREE_THOUSAND },
    {
      label: BASE_BET_AMOUNT.ONE_THOUSAND_TWO_HUNDRED.toString(),
      value: BASE_BET_AMOUNT.ONE_THOUSAND_TWO_HUNDRED,
    },
    { label: BASE_BET_AMOUNT.SIX_HUNDRED.toString(), value: BASE_BET_AMOUNT.SIX_HUNDRED },
    { label: BASE_BET_AMOUNT.THREE_HUNDRED.toString(), value: BASE_BET_AMOUNT.THREE_HUNDRED },
  ],
  [ChallengeType.EVEN_BET]: [{ label: BASE_BET_AMOUNT.TWO_THOUSAND, value: BASE_BET_AMOUNT.TWO_THOUSAND }],
};

// 定义表单数据类型
export interface ChallengeFormData {
  challengeType: string; // 打法
  operatorCode: string; // 投手编码
  locationId: number; // 地点ID
  name: string; // 挑战名称
  date: Date; // 日期
  principal: string; // 本金
  contriAmount: string; // 出资额
  initialBetAmount: number; // 投注基数
}
