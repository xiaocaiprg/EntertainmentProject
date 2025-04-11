import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { getChallengeList, getMatchDetail } from '../../api/services/gameService';
import { ChallengeListParams, GameMatchDto, GameMatchProfitDto } from '../../interface/Game';
import { ChallengeStatus } from '../../interface/Common';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';
import { getStatusText } from '../../public/Game';
import { ProfitModal } from './components/ProfitModal';

export const ProfitListScreen = React.memo(() => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [challengeList, setChallengeList] = useState<GameMatchDto[]>([]);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(10).current;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedProfit, setSelectedProfit] = useState<GameMatchProfitDto | null>(null);

  // 获取已完成的挑战列表
  const fetchCompletedChallenges = useCallback(async () => {
    setLoading(true);
    const params: ChallengeListParams = {
      pageNum: pageNum.current,
      pageSize: pageSize,
      isEnabledList: [ChallengeStatus.COMPLETED, ChallengeStatus.ENDED],
    };

    const res = await getChallengeList(params);
    setLoading(false);
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setChallengeList((prev) => [...prev, ...(res.records || [])]);
    }
  }, [pageNum, pageSize]);

  // 加载更多数据
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      pageNum.current += 1;
      fetchCompletedChallenges();
    }
  }, [loading, hasMore, fetchCompletedChallenges]);

  useEffect(() => {
    fetchCompletedChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取挑战详情
  const fetchChallengeDetail = useCallback(async (matchId: number) => {
    if (!matchId) {
      return;
    }
    setDetailLoading(true);
    const detailData = await getMatchDetail(matchId);
    if (detailData) {
      setSelectedProfit(detailData.gameMatchProfitDto || null);
    }
    setDetailLoading(false);
  }, []);

  // 点击挑战项，显示利润分配弹窗
  const handleItemPress = useCallback(
    (item: GameMatchDto) => {
      setModalVisible(true);
      if (item.id) {
        fetchChallengeDetail(item.id);
      }
    },
    [fetchChallengeDetail],
  );

  // 关闭弹窗
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedProfit(null);
  }, []);

  // 渲染挑战项
  const renderItem = useCallback(
    (item: GameMatchDto) => {
      const status = getStatusText(item.isEnabled);
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item)} activeOpacity={0.7}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
              {item.name || '-'}
            </Text>
            <View style={[styles.statusTag, { backgroundColor: status.color + '20' }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
            </View>
          </View>

          <View style={styles.itemContent}>
            <View style={styles.itemLeft}>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战时间:</Text>
                <Text style={styles.value}>{item.gameDate || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战上下水:</Text>
                <Text style={styles.value}>{item.profitStr || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战转码:</Text>
                <Text style={styles.value}>{item.turnOverStr || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>投手:</Text>
                <Text style={styles.value}>{item.playPersonName || '-'}</Text>
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

  // 渲染列表底部加载状态
  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={THEME_COLORS.primary} />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  }, [loading]);

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>查看利润分配</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.container}>
        <FlatList
          data={challengeList}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => `${String(item.id)}_${item.createTime}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshing={loading}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
        />
        {challengeList.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无已完成的挑战记录</Text>
          </View>
        )}
      </View>
      {selectedProfit ? (
        <ProfitModal
          visible={modalVisible}
          onClose={handleCloseModal}
          profit={selectedProfit}
          loading={detailLoading}
        />
      ) : null}
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
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  headerRight: {
    width: 36,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: THEME_COLORS.cardBackground,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 2,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
    paddingBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME_COLORS.text.primary,
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
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: THEME_COLORS.text.primary,
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
    color: THEME_COLORS.text.light,
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
    color: THEME_COLORS.text.light,
    marginTop: 12,
  },
});
