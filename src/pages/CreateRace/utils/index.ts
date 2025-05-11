import { CreateRaceParams } from '../../../interface/Race';
import { formatDate } from '../../../utils/date';
import { FormData } from '../interface/IModuleProps';

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * 验证创建比赛的参数
 * @param formData 表单数据
 * @returns 验证结果
 */
export const validateRaceParams = (formData: FormData): ValidationResult => {
  // 验证比赛名称
  if (!formData.name || formData.name.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'createRace.errors.nameRequired',
    };
  }

  // 验证开始时间
  if (!formData.beginDate) {
    return {
      isValid: false,
      errorMessage: 'createRace.errors.beginDateRequired',
    };
  }

  // 验证结束时间
  if (!formData.endDate) {
    return {
      isValid: false,
      errorMessage: 'createRace.errors.endDateRequired',
    };
  }

  // 验证开始时间和结束时间的关系
  if (formData.beginDate && formData.endDate) {
    const beginDate = new Date(formData.beginDate);
    const endDate = new Date(formData.endDate);

    if (beginDate >= endDate) {
      return {
        isValid: false,
        errorMessage: 'createRace.errors.dateRangeInvalid',
      };
    }
  }

  if (formData.turnOverLimit && formData.turnOverLimit.trim() !== '') {
    const turnOverLimit = Number(formData.turnOverLimit);
    if (isNaN(turnOverLimit) || turnOverLimit <= 0 || !Number.isInteger(turnOverLimit)) {
      return {
        isValid: false,
        errorMessage: 'createRace.errors.invalidTurnOverLimit',
      };
    }
  }

  return { isValid: true };
};

/**
 * 将表单数据转换为API请求参数
 * @param formData 表单数据
 * @returns CreateRaceParams 创建比赛的参数
 */
export const formDataToParams = (formData: FormData): CreateRaceParams => {
  const params: CreateRaceParams = {
    name: formData.name.trim(),
    beginDate: formatDate(formData.beginDate, 'YYYY-MM-DD'),
    endDate: formatDate(formData.endDate, 'YYYY-MM-DD'),
  };

  if (formData.description && formData.description.trim() !== '') {
    params.description = formData.description.trim();
  }

  if (formData.playRuleCode && formData.playRuleCode.trim() !== '') {
    params.playRuleCode = formData.playRuleCode.trim();
  }

  if (formData.turnOverLimit && formData.turnOverLimit.trim() !== '') {
    params.turnOverLimit = parseInt(formData.turnOverLimit.trim(), 10);
  }

  return params;
};
