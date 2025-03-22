import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RoundStats } from '../types';

interface GameInfoProps {
  gameName: string;
  operator: string;
  roundStats: RoundStats;
}

export const GameInfo: React.FC<GameInfoProps> = React.memo((props) => {
  const { gameName, operator, roundStats } = props;
  const { round, wins, losses, gamesPlayed, maxGames, isFirstRound, betAmount } = roundStats;
  // 获取轮次描述
  const getRoundDescription = () => {
    if (isFirstRound) {
      return '第一轮';
    } else {
      return `第${round}轮`;
    }
  };

  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoHeader}>
        <Text style={styles.gameName}>{gameName}</Text>
        <Text style={styles.operator}>操作者: {operator}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>当前轮次</Text>
          <Text style={styles.statValue}>{getRoundDescription()}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>押注金额</Text>
          <Text style={styles.statValue}>{betAmount}元</Text>
        </View>

        <View style={styles.flexRow}>
          <View style={styles.statItemHalf}>
            <Text style={styles.statLabel}>赢</Text>
            <Text style={[styles.statValue, styles.winValue]}>{wins}</Text>
          </View>

          <View style={styles.statItemHalf}>
            <Text style={styles.statLabel}>输</Text>
            <Text style={[styles.statValue, styles.loseValue]}>{losses}</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>游戏进度</Text>
          <Text style={styles.statValue}>
            {gamesPlayed} / {maxGames === Infinity ? '∞' : maxGames}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  operator: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  flexRow: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItemHalf: {
    width: '48%',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  winValue: {
    color: '#27ae60',
  },
  loseValue: {
    color: '#e74c3c',
  },
});
