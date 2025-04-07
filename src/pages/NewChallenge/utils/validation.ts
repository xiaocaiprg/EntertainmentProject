import { ChallengeCreateParams } from '../../../interface/Game';

/**
 * 校验挑战创建参数
 * @param params 挑战创建参数
 * @returns 校验结果对象，包含是否有效和错误信息
 */
export const validateChallengeParams = (
  params: Partial<ChallengeCreateParams>,
): { isValid: boolean; errorMessage?: string } => {
  if (!params.playPersonCode) {
    return { isValid: false, errorMessage: '请选择投手' };
  }
  if (!params.addressInfoId) {
    return { isValid: false, errorMessage: '请选择地点' };
  }

  if (!params.gameDate) {
    return { isValid: false, errorMessage: '请选择时间' };
  }
  if (params.principal === undefined || params.principal <= 0 || params.principal % 10000 !== 0) {
    return { isValid: false, errorMessage: '请输入有效的本金金额(需要10000的倍数)' };
  }
  if (
    params.contriAmount === undefined ||
    params.contriAmount < 0 ||
    (params.contriAmount > 0 && params.contriAmount % 10000 !== 0)
  ) {
    return { isValid: false, errorMessage: '请输入有效的出资额(需要10000的倍数)' };
  }
  if (params.contriAmount > params.principal) {
    return { isValid: false, errorMessage: '出资额不能大于本金' };
  }
  return { isValid: true };
};

/**
 * 校验数字输入
 * @param value 输入值
 * @returns 校验后的数字，如果无效则返回0
 */
export const validateNumberInput = (value: string): number => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0 ? num : 0;
};

/**
 * 检查金额是否为10000的倍数
 * @param value 金额数值
 * @returns 是否为10000的倍数
 */
export const isMultipleOf10000 = (value: number): boolean => {
  return value % 10000 === 0;
};
