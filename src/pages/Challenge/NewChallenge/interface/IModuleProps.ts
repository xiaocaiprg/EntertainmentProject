import { BASE_BET_AMOUNT } from '../../../../constants/betAmounts';
import { ChallengeType, FundraisingType } from '../../../../interface/Common';

// 定义下拉框枚举类型
export enum DropdownType {
  NONE = 'none',
  PLAYPERSON = 'operator',
  LOCATION = 'location',
  BET_AMOUNT = 'betAmount',
  CURRENCY = 'currency',
  COMPANY = 'company',
}

// 定义币种枚举
export enum CurrencyType {
  HKD = 'HKD',
  USD = 'USD',
}

// 币种选项
export const CURRENCY_OPTIONS = [
  { label: 'HKD', value: CurrencyType.HKD },
  { label: 'USD', value: CurrencyType.USD },
];

export const BET_AMOUNT_OPTIONS = {
  [ChallengeType.NO_PROFIT_LIMIT]: [
    { label: BASE_BET_AMOUNT.THREE_HUNDRED.toString(), value: BASE_BET_AMOUNT.THREE_HUNDRED },
    { label: BASE_BET_AMOUNT.SIX_HUNDRED.toString(), value: BASE_BET_AMOUNT.SIX_HUNDRED },
    {
      label: BASE_BET_AMOUNT.ONE_THOUSAND_TWO_HUNDRED.toString(),
      value: BASE_BET_AMOUNT.ONE_THOUSAND_TWO_HUNDRED,
    },
    { label: BASE_BET_AMOUNT.THREE_THOUSAND.toString(), value: BASE_BET_AMOUNT.THREE_THOUSAND },
    { label: BASE_BET_AMOUNT.THIRRTY_THOUSAND.toString(), value: BASE_BET_AMOUNT.THIRRTY_THOUSAND },
  ],
  [ChallengeType.EVEN_BET]: [{ label: BASE_BET_AMOUNT.TWO_THOUSAND, value: BASE_BET_AMOUNT.TWO_THOUSAND }],
  [ChallengeType.FREE_FIGHT]: [], // 自由搏击支持自定义输入
};

// 定义表单数据类型
export interface ChallengeFormData {
  challengeType: string; // 打法
  operatorCode: string; // 投手编码
  locationId: number; // 地点ID
  name: string; // 挑战名称
  date: Date; // 日期
  principal: string; // 本金
  // contriAmount: string; // 出资额
  initialBetAmount: number | number[]; // 投注基数，支持单个数字或数组
  currency: CurrencyType; // 币种
  fundraisingType: FundraisingType; // 募资方式
  selectedCompanyList: string[]; // 选中的公司列表
}
