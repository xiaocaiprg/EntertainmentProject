import { ChallengeCreateParams } from '../../../../interface/Game';
import { FundraisingType, ChallengeType } from '../../../../interface/Common';

/**
 * 校验投注基数
 * @param baseNumberList 投注基数数组
 * @param challengeType 挑战类型
 * @returns 校验结果对象，包含是否有效和错误信息
 */
export const validateBetAmount = (
  baseNumberList: number[],
  challengeType: string,
): { isValid: boolean; errorMessage?: string } => {
  for (const amount of baseNumberList) {
    if (!amount || isNaN(amount) || amount <= 0) {
      return { isValid: false, errorMessage: '所有投注基数必须为有效的正数' };
    }

    if (challengeType === ChallengeType.EVEN_BET) {
      // 平注法仅支持100的倍数
      if (amount % 100 !== 0) {
        return { isValid: false, errorMessage: '投注基数必须为100的倍数' };
      }
    } else if (challengeType === ChallengeType.NO_PROFIT_LIMIT) {
      // 无止盈打法仅支持300的倍数
      if (amount % 300 !== 0) {
        return { isValid: false, errorMessage: '投注基数必须为300的倍数' };
      }
    } else if (challengeType === ChallengeType.FREE_FIGHT) {
      // 自由搏击打法仅支持100的倍数
      if (amount % 100 !== 0) {
        return { isValid: false, errorMessage: '投注基数必须为100的倍数' };
      }
    }
  }

  return { isValid: true };
};

/**
 * 校验挑战创建参数
 * @param params 挑战创建参数
 * @returns 校验结果对象，包含是否有效和错误信息
 */
export const validateChallengeParams = (
  params: Partial<ChallengeCreateParams>,
): { isValid: boolean; errorMessage?: string } => {
  // 校验投注基数
  if (!params.baseNumberList || params.baseNumberList.length === 0) {
    return { isValid: false, errorMessage: '请输入投注基数' };
  }

  // 使用统一的投注基数校验函数
  if (params.playRuleCode) {
    const betAmountValidation = validateBetAmount(params.baseNumberList, params.playRuleCode);
    if (!betAmountValidation.isValid) {
      return betAmountValidation;
    }
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
