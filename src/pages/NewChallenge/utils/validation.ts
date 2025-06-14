import { ChallengeCreateParams } from '../../../interface/Game';
import { FundraisingType } from '../../../interface/Common';

/**
 * 校验挑战创建参数
 * @param params 挑战创建参数
 * @returns 校验结果对象，包含是否有效和错误信息
 */
export const validateChallengeParams = (
  params: Partial<ChallengeCreateParams>,
): { isValid: boolean; errorMessage?: string } => {
  if (!params.baseNumber || params.baseNumber < 0) {
    return { isValid: false, errorMessage: '请选择投注基数' };
  }
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
  if (!params.currency) {
    return { isValid: false, errorMessage: '请选择币种' };
  }
  if (!params.contributionType) {
    return { isValid: false, errorMessage: '请选择募资方式' };
  }
  // 定向募资时必须选择投资公司
  if (
    params.contributionType === FundraisingType.TARGETED &&
    (!params.investCompanyCodeList || params.investCompanyCodeList.length === 0)
  ) {
    return { isValid: false, errorMessage: '定向募资时必须选择至少一个投资公司' };
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
