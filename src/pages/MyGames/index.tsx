import React, { useCallback, useRef, useState } from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getChallengeList, getMatchDetail } from '../../api/services/gameService';
import { ContributionDto } from '../../interface/Contribution';
import { ChallengeListParams, GameMatchDto, GameMatchProfitDto } from '../../interface/Game';
import { ChallengeStatus } from '../../interface/Common';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';
import { getStatusText } from '../../public/Game';
import { ProfitModal } from './components/ProfitModal';
import { ContributionModal } from './components/ContributionModal';
import { useTranslation } from '../../hooks/useTranslation';
import useFocusRefresh from '../../hooks/useFocusRefresh';
import { useRole } from '../../hooks/useRole';
import { RootStackScreenProps } from '../router';

// 使用导航堆栈中定义的类型
type MyGamesScreenProps = RootStackScreenProps<'MyGames'>;

export const MyGamesScreen: React.FC<MyGamesScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { isOperationAdmin } = useRole();
  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [challengeList, setChallengeList] = useState<GameMatchDto[]>([]);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [profitModalVisible, setProfitModalVisible] = useState<boolean>(false);
  const [contributionModalVisible, setContributionModalVisible] = useState<boolean>(false);
  const [selectedContribution, setSelectedContribution] = useState<ContributionDto[]>([]);
  const [selectedProfit, setSelectedProfit] = useState<GameMatchProfitDto | null>(null);
  const lastFetchedMatchId = useRef<number>(-1);

  // 获取已完成的挑战列表
  const fetchCompletedChallenges = useCallback(async (shouldReset = false) => {
    setLoading(true);
    if (shouldReset) {
      pageNum.current = 1;
      setChallengeList([]);
    }
    const params: ChallengeListParams = {
      pageNum: pageNum.current,
      pageSize: pageSize.current,
    };

    const res = await getChallengeList(params);
    setLoading(false);
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setChallengeList((prev) => (shouldReset ? [...(res.records || [])] : [...prev, ...(res.records || [])]));
    }
  }, []);

  // 加载更多数据
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      pageNum.current += 1;
      fetchCompletedChallenges();
    }
  }, [loading, hasMore, fetchCompletedChallenges]);

  useFocusRefresh(() => {
    fetchCompletedChallenges(true);
  });

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

  // 查看场次详情
  const handleViewRoundDetail = useCallback(
    (item: GameMatchDto) => {
      item?.id && navigation.navigate('RoundDetail', { matchId: item.id });
    },
    [navigation],
  );
  const handleCloseProfitModal = useCallback(() => setProfitModalVisible(false), []);
  const handleCloseContributionModal = useCallback(() => setContributionModalVisible(false), []);

  const renderItem = useCallback(
    (item: GameMatchDto) => {
      const status = getStatusText(item.isEnabled);
      const showProfitBtn = item.isEnabled === ChallengeStatus.ENDED || item.isEnabled === ChallengeStatus.COMPLETED;
      const isAllRoundEnd = item.roundList?.every((round) => round.isEnabled === ChallengeStatus.ENDED);
      const showRestartBtn = item.isEnabled === ChallengeStatus.IN_PROGRESS && isAllRoundEnd && isOperationAdmin;
      const showEditBetBtn = item.isEnabled === ChallengeStatus.IN_PROGRESS && isOperationAdmin;

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
                <Text style={styles.label}>{t('myGames.challengeTime')}:</Text>
                <Text style={styles.value}>{item.gameDate || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>{t('myGames.challengeLocation')}:</Text>
                <Text style={styles.value}>{item.addressName}</Text>
              </View>
            </View>
            <View style={styles.itemLine}>
              <View style={styles.itemRow}>
                <Text style={styles.label}>{t('myGames.pitcher')}:</Text>
                <Text style={styles.value}>{item.playPersonName || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>{t('myGames.recorder')}:</Text>
                <Text style={styles.value}>{item.docPersonName || '-'}</Text>
              </View>
            </View>
            <View style={styles.itemLine}>
              <View style={styles.itemRow}>
                <Text style={styles.label}>{t('myGames.waterProfit')}:</Text>
                <Text style={styles.value}>{item.profitStr || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>{t('myGames.turnover')}:</Text>
                <Text style={styles.value}>{item.turnOverStr || '-'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {showRestartBtn && (
              <TouchableOpacity
                style={[styles.actionButton, styles.restartButton]}
                onPress={() => handleViewRoundDetail(item)}
              >
                <Icon name="refresh" size={12} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{t('myGames.restart')}</Text>
              </TouchableOpacity>
            )}
            {showEditBetBtn && (
              <TouchableOpacity
                style={[styles.actionButton, styles.editBetButton]}
                onPress={() => handleViewRoundDetail(item)}
              >
                <Icon name="edit" size={12} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{t('myGames.editBet')}</Text>
              </TouchableOpacity>
            )}
            {showProfitBtn && (
              <TouchableOpacity style={styles.actionButton} onPress={() => handleViewProfit(item)}>
                <Text style={styles.buttonText}>{t('myGames.viewProfit')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton} onPress={() => handleViewContribution(item)}>
              <Text style={styles.buttonText}>{t('myGames.viewContribution')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [handleViewProfit, handleViewContribution, handleViewRoundDetail, t, isOperationAdmin],
  );

  // 渲染列表底部加载状态
  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={THEME_COLORS.primary} />
        <Text style={styles.footerText}>{t('common.loading')}</Text>
      </View>
    );
  }, [loading, t]);

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
        <Text style={styles.headerTitle}>{t('myGames.title')}</Text>
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
            <Text style={styles.emptyText}>{t('myGames.noGames')}</Text>
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
    width: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    marginRight: 4,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: THEME_COLORS.text.primary,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: THEME_COLORS.border.light,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
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
  restartButton: {
    backgroundColor: '#4a6fa5',
  },
  editBetButton: {
    backgroundColor: '#5a9e6f',
  },
});

export default MyGamesScreen;
