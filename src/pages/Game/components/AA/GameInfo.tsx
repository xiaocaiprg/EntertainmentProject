import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../../../../components/CustomText';
import { AARoundStats } from '../../types/AAtypes';
interface GameInfoProps {
  gameName: string;
  operator: string;
  recorder: string;
  aaRoundStats: AARoundStats;
}

export const GameInfo: React.FC<GameInfoProps> = React.memo((props) => {
  const { gameName, operator, aaRoundStats, recorder } = props;
  const {
    round,
    wins,
    losses,
    gamesPlayed,
    maxGames,
    betAmount,
    roundProfitStr,
    roundTurnOverStr,
    challengeProfitStr,
    challengeTurnOverStr,
  } = aaRoundStats;
  // 获取轮次描述
  const getRoundDescription = () => {
    return `第${round}轮`;
  };

  // 判断上下水是正数还是负数来决定颜色
  const getProfitColor = (profitStr: string): string => {
    if (!profitStr) {
      return '#333';
    } // 默认颜色

    // 如果以负号开头，显示红色
    if (profitStr.startsWith('-')) {
      return '#e74c3c'; // 红色
    }
    // 如果是正数或0，显示绿色（0也显示为绿色）
    return '#27ae60'; // 绿色
  };

  return (
    <View style={styles.infoContainer}>
      <View style={styles.header}>
        <CustomText style={styles.gameName} numberOfLines={1}>
          {gameName}
        </CustomText>
        <CustomText style={styles.operator}>记录人: {recorder}</CustomText>
        <CustomText style={styles.operator}>投手: {operator}</CustomText>
      </View>
      <View style={styles.gridContainer}>
        <View style={styles.infoLine}>
          <View style={styles.infoLineItem}>
            <CustomText style={styles.label}>本挑战上下水:</CustomText>
            <CustomText style={[styles.value, { color: getProfitColor(challengeProfitStr) }]}>
              {challengeProfitStr}
            </CustomText>
          </View>
          <View style={styles.infoLineItem}>
            <CustomText style={styles.label}>本挑战转码:</CustomText>
            <CustomText style={styles.value}>{challengeTurnOverStr}</CustomText>
          </View>
        </View>
        <View style={styles.infoLine}>
          <View style={styles.infoLineItem}>
            <CustomText style={styles.label}>本场上下水:</CustomText>
            <CustomText style={[styles.value, { color: getProfitColor(roundProfitStr) }]}>{roundProfitStr}</CustomText>
          </View>
          <View style={styles.infoLineItem}>
            <CustomText style={styles.label}>本场转码:</CustomText>
            <CustomText style={styles.value}>{roundTurnOverStr}</CustomText>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <CustomText style={styles.label}>当前轮次:</CustomText>
            <CustomText style={styles.value}>{getRoundDescription()}</CustomText>
          </View>
          <View style={styles.infoItem}>
            <CustomText style={styles.label}>押注金额:</CustomText>
            <CustomText style={styles.value}>{betAmount}元</CustomText>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <CustomText style={styles.label}>赢:</CustomText>
            <CustomText style={[styles.value, styles.winValue]}>{wins}</CustomText>
          </View>

          <View style={styles.infoItem}>
            <CustomText style={styles.label}>输:</CustomText>
            <CustomText style={[styles.value, styles.loseValue]}>{losses}</CustomText>
          </View>
          <View style={styles.infoItem}>
            <CustomText style={styles.label}>进度:</CustomText>
            <CustomText style={styles.value}>
              {gamesPlayed} / {maxGames === Infinity ? '∞' : maxGames}
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: '#fff',
    marginTop: 6,
    marginHorizontal: 10,
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  gameName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: '65%',
  },
  operator: {
    fontSize: 12,
    color: '#666',
  },
  gridContainer: {
    flexDirection: 'column',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  infoLine: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 4,
    borderRadius: 3,
  },
  infoLineItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 4,
    borderRadius: 3,
    marginRight: 3,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginRight: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  winValue: {
    color: '#27ae60',
  },
  loseValue: {
    color: '#e74c3c',
  },
});
