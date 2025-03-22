import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getChallengeList } from '../../api/services/gameService';
import { GameMatchDto } from '../../interface/Game';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';

export const GameHistory = React.memo(() => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);
  const [historyList, setHistoryList] = useState<GameMatchDto[]>([]);
  const [pageNum, setPageNum] = useState<string>('1');
  const pageSize = useRef<string>('20').current;
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchHistoryList = useCallback(async () => {
    const res = await getChallengeList({
      pageNum: pageNum,
      pageSize: pageSize,
    });
    setLoading(false);
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setHistoryList((prev) => [...prev, ...(res.records || [])]);
    }
  }, [pageNum, pageSize]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPageNum(String(Number(pageNum) + 1));
      fetchHistoryList();
    }
  }, [loading, hasMore, pageNum, fetchHistoryList]);

  useEffect(() => {
    fetchHistoryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = useCallback(({ item }: { item: GameMatchDto }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemRow}>
          <Text style={styles.label}>挑战上下水:</Text>
          <Text style={styles.value}>{item.profitStr || '-'}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.label}>挑战转码:</Text>
          <Text style={styles.value}>{item.turnOverStr || '-'}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.label}>打手名字:</Text>
          <Text style={styles.value}>{item.playPersonName || '-'}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.label}>投资人:</Text>
          <Text style={styles.value}>{item.investPersonName || '-'}</Text>
        </View>
      </View>
    );
  }, []);

  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  }, [loading]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>历史记录</Text>
        <View style={styles.headerRight} />
      </View>
      <View style={styles.container}>
        <FlatList
          data={historyList}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshing={loading}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
        />
        {historyList.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无历史记录</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 36,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  footerContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
