import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * 自定义Hook，用于处理页面获取焦点时刷新数据
 * @param refreshFunction 需要执行的刷新函数
 * @param deps 依赖数组，默认为空数组
 */
export const useFocusRefresh = (refreshFunction: () => void, deps: React.DependencyList = []) => {
  useFocusEffect(
    useCallback(() => {
      console.log('页面获取焦点', refreshFunction);
      refreshFunction();
      return () => {
        console.log('页面失去焦点');
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]),
  );
};

export default useFocusRefresh;
