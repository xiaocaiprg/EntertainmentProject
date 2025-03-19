import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { formatAmount } from '../../../utils/platform';
import { SHADOW_STYLE, THEME_COLORS } from '../../../utils/styles';

interface HistoryRecord {
  id: number;
  time: string;
  result: string;
  betAmount: number;
  round: number;
  gameNumber: number;
  isWin: boolean;
  choice?: 'banker_win' | 'banker_lose' | 'player_win' | 'player_lose' | null;
}

interface HistoryListProps {
  groupedHistory: Record<string, HistoryRecord[]>;
}

export const HistoryList: React.FC<HistoryListProps> = React.memo(({ groupedHistory }) => {
  const hasHistory = useMemo(() => Object.keys(groupedHistory || {}).length > 0, [groupedHistory]);

  // 计算每一轮的统计数据
  const getRoundStats = (records: HistoryRecord[]) => {
    if (!records || records.length === 0) {
      return { wins: 0, losses: 0, total: 0, betAmount: 0, netResult: 0, profit: 0 };
    }

    const wins = records.filter((r) => r.isWin).length;
    const losses = records.length - wins;
    const betAmount = records[0]?.betAmount > 0 ? records[0]?.betAmount : Math.abs(records[0]?.betAmount) || 0;
    const profit = records.reduce((sum, record) => sum + record.betAmount, 0);

    return {
      wins,
      losses,
      total: records.length,
      betAmount,
      netResult: wins - losses,
      profit,
    };
  };

  // 计算所有轮次的累计数据
  const totalStats = useMemo(() => {
    if (!hasHistory) {
      return { totalGames: 0, totalProfit: 0, totalWins: 0, totalLosses: 0 };
    }

    let totalGames = 0;
    let totalProfit = 0;
    let totalWins = 0;
    let totalLosses = 0;

    Object.values(groupedHistory).forEach((records) => {
      totalGames += records.length;
      totalProfit += records.reduce((sum, record) => sum + record.betAmount, 0);
      totalWins += records.filter((r) => r.isWin).length;
      totalLosses += records.filter((r) => !r.isWin).length;
    });

    return { totalGames, totalProfit, totalWins, totalLosses };
  }, [groupedHistory, hasHistory]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>历史记录</Text>

        {!hasHistory ? (
          <Text style={styles.emptyText}>暂无历史记录</Text>
        ) : (
          <ScrollView style={styles.mainScrollView} showsVerticalScrollIndicator={false}>
            {/* 总统计信息 */}
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>总局数</Text>
                  <Text style={styles.totalValue}>{totalStats.totalGames}</Text>
                </View>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>胜/负</Text>
                  <Text style={styles.totalValue}>
                    {totalStats.totalWins}/{totalStats.totalLosses}
                  </Text>
                </View>
                <View style={styles.totalItem}>
                  <Text style={styles.totalLabel}>收益</Text>
                  <Text
                    style={[
                      styles.totalValue,
                      totalStats.totalProfit > 0 ? styles.profit : totalStats.totalProfit < 0 ? styles.loss : {},
                    ]}
                  >
                    {formatAmount(totalStats.totalProfit)}
                  </Text>
                </View>
              </View>
            </View>

            {/* 按轮次分组展示 */}
            {Object.entries(groupedHistory).map(([roundKey, records]) => {
              const stats = getRoundStats(records);

              return (
                <View key={roundKey} style={styles.roundSection}>
                  {/* 轮次标题和统计 */}
                  <View style={styles.roundHeader}>
                    <View style={styles.roundInfo}>
                      <Text style={styles.roundTitle}>{roundKey}</Text>
                      <Text style={styles.roundStats}>
                        {stats.betAmount}元/局 · {stats.wins}胜{stats.losses}负 ·
                        <Text style={stats.profit > 0 ? styles.profit : stats.profit < 0 ? styles.loss : {}}>
                          {formatAmount(stats.profit)}
                        </Text>
                      </Text>
                    </View>
                  </View>

                  {/* 局记录列表 */}
                  <View style={styles.gamesList}>
                    {records.map((record) => (
                      <View key={record.id} style={styles.gameItem}>
                        <View style={styles.gameInfo}>
                          <Text style={styles.gameNumber}>第{record.gameNumber}局</Text>
                          <Text style={styles.gameTime}>{record.time}</Text>
                        </View>
                        <View style={styles.gameResult}>
                          <Text style={[styles.resultText, record.isWin ? styles.profit : styles.loss]}>
                            {record.result}
                          </Text>
                          <Text style={[styles.amountText, record.betAmount > 0 ? styles.profit : styles.loss]}>
                            {formatAmount(record.betAmount)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    ...SHADOW_STYLE,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLORS.text.primary,
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: THEME_COLORS.text.light,
    marginTop: 30,
    marginBottom: 30,
  },
  mainScrollView: {
    flex: 1,
  },
  totalSection: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalItem: {
    alignItems: 'center',
    flex: 1,
  },
  totalLabel: {
    fontSize: 13,
    color: THEME_COLORS.text.light,
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME_COLORS.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  roundSection: {
    marginBottom: 15,
  },
  roundHeader: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
    backgroundColor: THEME_COLORS.background,
    borderRadius: 5,
  },
  roundInfo: {
    flex: 1,
  },
  roundTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
  },
  roundStats: {
    fontSize: 13,
    color: THEME_COLORS.text.secondary,
    marginTop: 3,
  },
  gamesList: {
    marginTop: 5,
  },
  gameItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
  },
  gameInfo: {
    flex: 1,
  },
  gameNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME_COLORS.text.secondary,
  },
  gameTime: {
    fontSize: 12,
    color: THEME_COLORS.text.light,
    marginTop: 3,
  },
  gameResult: {
    alignItems: 'flex-end',
  },
  resultText: {
    fontSize: 14,
    fontWeight: '500',
  },
  amountText: {
    fontSize: 13,
    marginTop: 3,
  },
  profit: {
    color: THEME_COLORS.success,
  },
  loss: {
    color: THEME_COLORS.danger,
  },
});
