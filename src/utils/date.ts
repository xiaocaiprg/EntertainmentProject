/**
 * 格式化日期时间
 * @param {Date} date 日期对象
 * @param {string} format 格式字符串
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month < 10 ? `0${month}` : month.toString())
    .replace('DD', day < 10 ? `0${day}` : day.toString())
    .replace('HH', hours < 10 ? `0${hours}` : hours.toString())
    .replace('mm', minutes < 10 ? `0${minutes}` : minutes.toString())
    .replace('ss', seconds < 10 ? `0${seconds}` : seconds.toString());
};

/**
 * 格式化时间
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的时间字符串 (HH:mm:ss)
 */
export const formatTime = (date: Date): string => {
  return formatDate(date, 'HH:mm:ss');
};

/**
 * 获取当前时间的格式化字符串
 * @returns {string} 当前时间的格式化字符串 (HH:mm:ss)
 */
export const getCurrentTime = (): string => {
  return formatTime(new Date());
};
