import React from 'react';
import { View, StyleSheet } from 'react-native';
import { THEME_COLORS } from '../../../../utils/styles';
import CustomText from '../../../../components/CustomText';

export const RankingRulesContent = React.memo(() => {
  return (
    <View>
      <View style={styles.ruleItem}>
        <CustomText style={styles.ruleNumber}>1.</CustomText>
        <CustomText style={styles.ruleText}>命中率 = 胜局数 / 总局数</CustomText>
      </View>
      <View style={styles.ruleItem}>
        <CustomText style={styles.ruleNumber}>2.</CustomText>
        <CustomText style={styles.ruleText}>杀数 = 上下水 / 转码</CustomText>
      </View>
      <View style={styles.ruleItem}>
        <CustomText style={styles.ruleNumber}>3.</CustomText>
        <CustomText style={styles.ruleText}>榜单每日凌晨更新前N天数据</CustomText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ruleNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME_COLORS.primary,
    width: 20,
  },
  ruleText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
});

export default RankingRulesContent;
