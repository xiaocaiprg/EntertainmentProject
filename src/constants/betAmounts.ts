/**
 * 投注基数常量
 */
export const BASE_BET_AMOUNT = {
  THREE_HUNDRED: 300,
  SIX_HUNDRED: 600,
  ONE_THOUSAND_TWO_HUNDRED: 1200,
  TWO_THOUSAND: 2000,
  THREE_THOUSAND: 3000,
  THIRRTY_THOUSAND: 30000,
};

/**
 * 获取投注基数倍数
 * @param betAmount 投注基数
 * @returns 对应的倍数
 */
export const getBetMultiplier = (betAmount: number): number => {
  return betAmount / 3;
};

/**
 * 默认初始押注金额
 */
export const INITIAL_BET_AMOUNT = BASE_BET_AMOUNT.THREE_THOUSAND;
