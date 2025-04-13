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
import { ContributionDto } from '../../interface/Contribution';
import { ChallengeListParams, GameMatchDto, GameMatchProfitDto } from '../../interface/Game';
import { ChallengeStatus } from '../../interface/Common';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';
import { getStatusText } from '../../public/Game';
import { ProfitModal } from './components/ProfitModal';
import ContributionModal from './components/ContributionModal';

export const MyGamesScreen = React.memo(() => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [challengeList, setChallengeList] = useState<GameMatchDto[]>([]);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(10).current;
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [profitModalVisible, setProfitModalVisible] = useState<boolean>(false);
  const [contributionModalVisible, setContributionModalVisible] = useState<boolean>(false);
  const [selectedContribution, setSelectedContribution] = useState<ContributionDto[]>([]);
  const [selectedProfit, setSelectedProfit] = useState<GameMatchProfitDto | null>(null);
  const lastFetchedMatchId = useRef<number>(-1);

  // 获取已完成的挑战列表
  const fetchCompletedChallenges = useCallback(async () => {
    setLoading(true);
    const params: ChallengeListParams = {
      pageNum: pageNum.current,
      pageSize: pageSize,
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

    // 如果是同一个挑战ID，则直接复用数据
    if (lastFetchedMatchId.current === matchId) {
      return;
    }

    setDetailLoading(true);
    const detailData = await getMatchDetail(matchId);
    if (detailData) {
      setSelectedProfit(detailData.gameMatchProfitDto || null);
      setSelectedContribution(detailData.contributionDtoList || []);
      lastFetchedMatchId.current = matchId;
    }
    setDetailLoading(false);
  }, []);

  // 查看利润分配
  const handleViewProfit = useCallback(
    (item: GameMatchDto) => {
      setProfitModalVisible(true);
      if (item.id) {
        fetchChallengeDetail(item.id);
      }
    },
    [fetchChallengeDetail],
  );

  // 查看出资详情
  const handleViewContribution = useCallback(
    (item: GameMatchDto) => {
      setContributionModalVisible(true);
      if (item.id) {
        fetchChallengeDetail(item.id);
      }
    },
    [fetchChallengeDetail],
  );

  // 关闭利润弹窗
  const handleCloseProfitModal = useCallback(() => {
    setProfitModalVisible(false);
  }, []);

  // 关闭出资弹窗
  const handleCloseContributionModal = useCallback(() => {
    setContributionModalVisible(false);
  }, []);

  // 渲染挑战项
  const renderItem = useCallback(
    (item: GameMatchDto) => {
      const status = getStatusText(item.isEnabled);
      const showProfitBtn = item.isEnabled === ChallengeStatus.ENDED || item.isEnabled === ChallengeStatus.COMPLETED;
      return (
        <View style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
              {item.name || '-'}
            </Text>
            <View style={[styles.statusTag, { backgroundColor: status.color + '20' }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
            </View>
          </View>
          <View style={styles.itemContent}>
            <View style={styles.itemLine}>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战时间:</Text>
                <Text style={styles.value}>{item.gameDate || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战地点:</Text>
                <Text style={styles.value}>{item.addressName}</Text>
              </View>
            </View>
            <View style={styles.itemLine}>
              <View style={styles.itemRow}>
                <Text style={styles.label}>投手:</Text>
                <Text style={styles.value}>{item.playPersonName || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>记录:</Text>
                <Text style={styles.value}>{item.docPersonName || '-'}</Text>
              </View>
            </View>
            <View style={styles.itemLine}>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战上下水:</Text>
                <Text style={styles.value}>{item.profitStr || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战转码:</Text>
                <Text style={styles.value}>{item.turnOverStr || '-'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {showProfitBtn && (
              <TouchableOpacity style={styles.actionButton} onPress={() => handleViewProfit(item)}>
                <Text style={styles.buttonText}>查看利润分配</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton} onPress={() => handleViewContribution(item)}>
              <Text style={styles.buttonText}>查看出资</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [handleViewProfit, handleViewContribution],
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
        <Text style={styles.headerTitle}>我的挑战</Text>
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
          visible={profitModalVisible}
          onClose={handleCloseProfitModal}
          profit={selectedProfit}
          loading={detailLoading}
        />
      ) : null}
      <ContributionModal
        visible={contributionModalVisible}
        onClose={handleCloseContributionModal}
        selectedContribution={selectedContribution}
        loading={detailLoading}
      />
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
    paddingBottom: 10,
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
    flexDirection: 'column',
  },
  itemLine: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
  },
  value: {
    fontSize: 14,
    color: THEME_COLORS.text.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME_COLORS.border.light,
    paddingTop: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
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

export default MyGamesScreen;
