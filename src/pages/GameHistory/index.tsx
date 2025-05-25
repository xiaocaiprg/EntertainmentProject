import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import CustomText from '../../components/CustomText';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getChallengeList } from '../../api/services/gameService';
import { GameMatchPageDto } from '../../interface/Game';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { getStatusText } from '../../public/Game';

export const GameHistory = React.memo(() => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);
  const [historyList, setHistoryList] = useState<GameMatchPageDto[]>([]);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(5).current;
  const [hasMore, setHasMore] = useState<boolean>(false);

  const fetchHistoryList = useCallback(async () => {
    setLoading(true);
    const res = await getChallengeList({
      pageNum: pageNum.current,
      pageSize: pageSize,
    });
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setHistoryList((prev) => [...prev, ...(res.records || [])]);
    }
    setLoading(false);
  }, [pageNum, pageSize]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      pageNum.current += 1;
      fetchHistoryList();
    }
  }, [loading, hasMore, fetchHistoryList]);

  useEffect(() => {
    fetchHistoryList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemPress = useCallback(
    (matchId: number | undefined) => {
      if (matchId) {
        navigation.navigate('ChallengeDetail', { matchId });
      }
    },
    [navigation],
  );

  const renderItem = useCallback(
    (item: GameMatchPageDto) => {
      const status = getStatusText(item.isEnabled);

      return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item.id)} activeOpacity={0.7}>
          <View style={styles.itemHeader}>
            <CustomText style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
              {item.name || '-'}
            </CustomText>
            <View style={[styles.statusTag, { backgroundColor: status.color + '20' }]}>
              <CustomText style={[styles.statusText, { color: status.color }]}>{status.text}</CustomText>
            </View>
          </View>

          <View style={styles.itemContent}>
            <View style={styles.itemLeft}>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>创建时间:</CustomText>
                <CustomText style={styles.value}>{item.createTime || '-'}</CustomText>
              </View>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>挑战上下水:</CustomText>
                <CustomText style={styles.value}>{item.profitStr || '-'}</CustomText>
              </View>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>挑战转码:</CustomText>
                <CustomText style={styles.value}>{item.turnOverStr || '-'}</CustomText>
              </View>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>投手:</CustomText>
                <CustomText style={styles.value}>{item.playPersonName || '-'}</CustomText>
              </View>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>记录人:</CustomText>
                <CustomText style={styles.value}>{item.docPersonName || '-'}</CustomText>
              </View>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>挑战开始时间:</CustomText>
                <CustomText style={styles.value}>{item.gameDate || '-'}</CustomText>
              </View>
            </View>

            <View style={styles.arrowContainer}>
              <Icon name="chevron-right" size={20} color="#bbb" />
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [handleItemPress],
  );

  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
        <CustomText style={styles.footerText}>加载中...</CustomText>
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
        <CustomText style={styles.headerTitle}>历史记录</CustomText>
        <View style={styles.headerRight} />
      </View>
      <View style={styles.container}>
        <FlatList
          data={historyList}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => `${String(item.id)}+${item.createTime}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshing={loading}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
        />
        {historyList.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>暂无历史记录</CustomText>
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
    height: 40,
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
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemContent: {
    flexDirection: 'row',
  },
  itemLeft: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
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
