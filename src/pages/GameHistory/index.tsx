import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getGameHistory, GameHistory } from '../../api/services/gameService';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface GameHistoryProps {
  navigation: any;
}

export const GameHistoryScreen: React.FC<GameHistoryProps> = ({ navigation }) => {
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      const historyData = await getGameHistory();
      setLoading(false);
      setHistory(historyData);
    } catch (err) {
      console.error('获取历史记录失败:', err);
    }
  }, []);
  const isEmpty = useMemo(() => history.length === 0, [history]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderHistoryItem = useCallback(({ item }: { item: GameHistory }) => {
    return (
      <View style={styles.historyItem}>
        <View style={styles.gameInfoContainer}>
          <Text style={styles.gameName}>{item.gameName}</Text>
          <Text style={styles.gameDate}>{item.date}</Text>
        </View>
        <View style={styles.resultContainer}>
          <Text style={[styles.gameResult, item.amount > 0 ? styles.winResult : styles.loseResult]}>{item.result}</Text>
          <Text style={[styles.amount, item.amount > 0 ? styles.win : styles.lose]}>
            {item.amount > 0 ? '+' : ''}
            {item.amount}
          </Text>
        </View>
      </View>
    );
  }, []);
  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6c5ce7" />
        </View>
      );
    }
    if (isEmpty) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="history" size={60} color="#ccc" />
          <Text style={styles.emptyText}>暂无游戏记录</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    );
  }, [history, isEmpty, loading, renderHistoryItem]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>历史记录</Text>
        <View style={{ width: 24 }} />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 10,
  },
  listContainer: {
    padding: 15,
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gameInfoContainer: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  gameDate: {
    fontSize: 14,
    color: '#95a5a6',
  },
  resultContainer: {
    alignItems: 'flex-end',
  },
  gameResult: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  win: {
    color: '#2ecc71',
  },
  lose: {
    color: '#e74c3c',
  },
  winResult: {
    color: '#2ecc71',
  },
  loseResult: {
    color: '#e74c3c',
  },
});

export default GameHistoryScreen;
