import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { HistoryRecord } from '../../types/CBtypes';
import { groupRecordsByRound, getChoiceDisplayText } from '../../utils/historyHelper';
import CustomText from '../../../../components/CustomText';

interface GameHistoryProps {
  historyRecords: HistoryRecord[];
}

export const GameHistory: React.FC<GameHistoryProps> = React.memo(({ historyRecords }) => {
  // 按轮次分组历史记录
  const groupedRecords = useMemo(() => {
    return groupRecordsByRound(historyRecords);
  }, [historyRecords]);
  // 轮次列表，从大到小排序
  const rounds = useMemo(() => {
    return Object.keys(groupedRecords)
      .map(Number)
      .sort((a, b) => b - a); // 降序排列，最新的轮次在前面
  }, [groupedRecords]);

  return (
    <View style={styles.historyContainer}>
      <CustomText style={styles.title}>历史记录</CustomText>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {rounds.length === 0 ? (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>暂无历史记录</CustomText>
          </View>
        ) : (
          rounds.map((round) => (
            <View key={`round-${round}`} style={styles.roundContainer}>
              <View style={styles.roundHeader}>
                <CustomText style={styles.roundTitle}>第 {round} 轮</CustomText>
              </View>
              {groupedRecords[round].map((record) => (
                <View key={`record-${record.id}`} style={styles.recordItem}>
                  <CustomText style={styles.betAmountText}>押注：{record.betAmount}</CustomText>
                  <CustomText style={[styles.choiceText, record.isWin ? styles.winText : styles.loseText]}>
                    {getChoiceDisplayText(record.choice)}
                  </CustomText>
                  <CustomText style={styles.timeText}>{record.time}</CustomText>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  roundContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    paddingVertical: 5,
  },
  roundHeader: {
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  roundTitle: {
    color: '#3300FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  timeText: {
    color: '#666',
    fontSize: 14,
  },
  resultText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  winText: {
    color: '#27ae60',
  },
  loseText: {
    color: '#e74c3c',
  },
  choiceText: {
    fontSize: 15,
    color: '#333',
  },
  betAmountText: {
    fontSize: 15,
    color: '#333',
  },
});
