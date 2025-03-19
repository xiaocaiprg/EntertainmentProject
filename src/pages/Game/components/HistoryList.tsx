import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

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

  // 根据结果类型返回样式
  const getResultStyle = (result: string) => {
    if (result.includes('庄')) {
      return result.includes('赢') ? styles.bankerWin : styles.bankerLose;
    } else if (result.includes('闲')) {
      return result.includes('赢') ? styles.playerWin : styles.playerLose;
    }
    return {};
  };

  // 格式化金额显示
  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount);
    const prefix = amount >= 0 ? '+' : '-';
    return `${prefix}${absAmount}元`;
  };

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

  return (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>历史记录</Text>

      {!hasHistory ? (
        <Text style={styles.emptyHistory}>暂无历史记录</Text>
      ) : (
        <ScrollView style={styles.historyList} contentContainerStyle={styles.historyContent}>
          {Object.entries(groupedHistory).map(([roundKey, records]) => {
            const stats = getRoundStats(records);
            const isFirstRound = records[0]?.round === 1;
            const is3kRoundAgain = !isFirstRound && records[0]?.betAmount >= 3000 && records[0]?.round > 2;

            let roundDescription = roundKey;
            if (isFirstRound) {
              roundDescription += ' (初始轮)';
            } else if (is3kRoundAgain) {
              roundDescription += ' (第二次3K)';
            }

            return (
              <View key={roundKey} style={styles.historyRound}>
                <View style={styles.roundHeader}>
                  <Text style={styles.historyRoundTitle}>{roundDescription}</Text>
                  <Text style={styles.roundBetAmount}>{stats.betAmount}元/局</Text>
                </View>

                <View style={styles.roundStats}>
                  <Text
                    style={[
                      styles.roundStatText,
                      stats.netResult > 0 ? styles.winStat : stats.netResult < 0 ? styles.loseStat : {},
                    ]}
                  >
                    {stats.wins}胜 {stats.losses}负 (净{stats.netResult > 0 ? '胜' : '负'}
                    {Math.abs(stats.netResult)}局)
                  </Text>
                  <Text
                    style={[
                      styles.profitText,
                      stats.profit > 0 ? styles.winStat : stats.profit < 0 ? styles.loseStat : {},
                    ]}
                  >
                    收益: {formatAmount(stats.profit)}
                  </Text>
                </View>

                <View style={styles.gamesContainer}>
                  {records.map((record) => (
                    <View key={record.id} style={styles.historyItem}>
                      <View style={styles.gameNumberContainer}>
                        <Text style={styles.historyGameNumber}>第{record.gameNumber}局</Text>
                        <Text style={styles.historyTime}>{record.time}</Text>
                      </View>
                      <View style={styles.resultContainer}>
                        <View style={[styles.resultBadge, record.isWin ? styles.winBadge : styles.loseBadge]}>
                          <Text style={[styles.historyResult, getResultStyle(record.result), styles.resultText]}>
                            {record.result}
                          </Text>
                        </View>
                        <Text style={[styles.amountText, record.betAmount >= 0 ? styles.winAmount : styles.loseAmount]}>
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
  );
});

const styles = StyleSheet.create({
  historyContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  historyList: {
    flex: 1,
  },
  historyContent: {
    paddingBottom: 5,
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    marginBottom: 20,
    flex: 1,
  },
  historyRound: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#6c5ce7',
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyRoundTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  roundBetAmount: {
    fontSize: 14,
    color: '#444',
    fontWeight: 'bold',
  },
  roundStats: {
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 4,
    marginBottom: 8,
  },
  roundStatText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#555',
  },
  profitText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 4,
    color: '#555',
  },
  winStat: {
    color: '#27ae60',
  },
  loseStat: {
    color: '#e74c3c',
  },
  gamesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 3,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  gameNumberContainer: {
    flexDirection: 'column',
  },
  historyGameNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  historyTime: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  resultContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  winBadge: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
  },
  loseBadge: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  historyResult: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 15,
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  winAmount: {
    color: '#27ae60',
  },
  loseAmount: {
    color: '#e74c3c',
  },
  bankerWin: {
    color: '#e74c3c',
  },
  bankerLose: {
    color: '#9b0c00',
  },
  playerWin: {
    color: '#3498db',
  },
  playerLose: {
    color: '#1a5276',
  },
});
