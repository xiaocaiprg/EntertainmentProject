/**
 * 校验押注金额
 * @param value 待校验的金额字符串
 * @param min 最小值（默认为0）
 * @param max 最大值（默认为3000000）
 * @returns 校验结果 {valid: boolean, value?: number, errorKey?: string}
 */
export const validateBetAmount = (
  value: string,
  min = 0,
  max = 3000000,
): { valid: boolean; value?: number; errorKey?: string } => {
  // 非数字检查（使用正则表达式确保整个字符串只包含数字）
  if (!value || !value.trim() || !/^\d+$/.test(value)) {
    return { valid: false, errorKey: 'roundDetail.inputNumber' };
  }

  const numValue = parseInt(value, 10);

  // 范围检查
  if (numValue <= min) {
    return { valid: false, errorKey: 'roundDetail.betAmountMin' };
  }

  if (numValue >= max) {
    return { valid: false, errorKey: 'roundDetail.betAmountMax' };
  }

  // 检查是否为100的倍数
  if (numValue % 100 !== 0) {
    return { valid: false, errorKey: 'roundDetail.betAmountMultiple' };
  }

  // 验证通过
  return { valid: true, value: numValue };
};
