import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  getChallengeList,
  getMatchDetail,
  updateMatchStatus,
  updateMatchContributeType,
} from '../../../api/services/gameService';
import { ContributionDto } from '../../../interface/Contribution';
import { ChallengeListParams, GameMatchPageDto, GameMatchProfitDto } from '../../../interface/Game';
import { ChallengeStatus, FundraisingType, IsInside } from '../../../interface/Common';
import { STATUS_BAR_HEIGHT, isIOS } from '../../../utils/platform';
import { THEME_COLORS } from '../../../utils/styles';
import { getStatusText } from '../../../public/Game';
import CustomText from '../../../components/CustomText';
import { ProfitModal } from './components/ProfitModal';
import { ContributionModal } from './components/ContributionModal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useTranslation } from '../../../hooks/useTranslation';
import useFocusRefresh from '../../../hooks/useFocusRefresh';
import { useRole } from '../../../hooks/useRole';
import { RootStackScreenProps } from '../../router';

// 使用导航堆栈中定义的类型
type MyGamesScreenProps = RootStackScreenProps<'MyGames'>;

export const MyGamesScreen: React.FC<MyGamesScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { isOperationAdmin, isInvestmentManager } = useRole();
  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [challengeList, setChallengeList] = useState<GameMatchPageDto[]>([]);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [profitModalVisible, setProfitModalVisible] = useState<boolean>(false);
  const [contributionModalVisible, setContributionModalVisible] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [convertToPublicModalVisible, setConvertToPublicModalVisible] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [selectedContribution, setSelectedContribution] = useState<ContributionDto[]>([]);
  const [selectedProfit, setSelectedProfit] = useState<GameMatchProfitDto | null>(null);
  const [currency, setCurrency] = useState<string>('');
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
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setChallengeList((prev) => (shouldReset ? [...(res.records || [])] : [...prev, ...(res.records || [])]));
    }
    setLoading(false);
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
      setCurrency(detailData.currency || '');
      lastFetchedMatchId.current = matchId;
    }
    setDetailLoading(false);
  }, []);

  // 查看利润分配
  const handleViewProfit = useCallback(
    (item: GameMatchPageDto) => {
      setProfitModalVisible(true);
      if (item.id) {
        fetchChallengeDetail(item.id);
      }
    },
    [fetchChallengeDetail],
  );

  // 查看出资详情
  const handleViewContribution = useCallback(
    (item: GameMatchPageDto) => {
      setContributionModalVisible(true);
      if (item.id) {
        fetchChallengeDetail(item.id);
      }
    },
    [fetchChallengeDetail],
  );

  // 查看场次详情
  const handleViewRoundDetail = useCallback(
    (item: GameMatchPageDto) => {
      item?.id && navigation.navigate('RoundDetail', { matchId: item.id });
    },
    [navigation],
  );
  const handleChallengeDetail = useCallback(
    (item: GameMatchPageDto) => {
      item?.id && navigation.navigate('ChallengeDetail', { matchId: item.id });
    },
    [navigation],
  );
  const handleCloseProfitModal = useCallback(() => setProfitModalVisible(false), []);
  const handleCloseContributionModal = useCallback(() => setContributionModalVisible(false), []);

  // 显示结束挑战确认弹窗
  const showEndChallengeConfirm = useCallback((matchId: number) => {
    if (matchId) {
      setSelectedMatchId(matchId);
      setConfirmModalVisible(true);
    }
  }, []);

  // 隐藏结束挑战确认弹窗
  const hideEndChallengeConfirm = useCallback(() => {
    setConfirmModalVisible(false);
    setSelectedMatchId(null);
  }, []);

  // 显示转公开确认弹窗
  const showConvertToPublicConfirm = useCallback((matchId: number) => {
    if (matchId) {
      setSelectedMatchId(matchId);
      setConvertToPublicModalVisible(true);
    }
  }, []);

  // 隐藏转公开确认弹窗
  const hideConvertToPublicConfirm = useCallback(() => {
    setConvertToPublicModalVisible(false);
    setSelectedMatchId(null);
  }, []);

  // 确认结束挑战
  const confirmEndChallenge = useCallback(async () => {
    if (!selectedMatchId) {
      return;
    }

    setProcessing(true);
    try {
      const result = await updateMatchStatus({
        id: selectedMatchId,
        isEnabled: ChallengeStatus.ENDED, // 设置为已结束状态
      });
      if (result) {
        fetchCompletedChallenges(true);
        Alert.alert(t('common.success'), t('challengeDetail.endSuccess'));
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    }
    setProcessing(false);
    setConfirmModalVisible(false);
    setSelectedMatchId(null);
  }, [selectedMatchId, fetchCompletedChallenges, t]);

  // 确认转为公开募资
  const confirmConvertToPublic = useCallback(async () => {
    if (!selectedMatchId) {
      return;
    }

    setProcessing(true);
    try {
      const result = await updateMatchContributeType({
        id: selectedMatchId,
        contributionType: FundraisingType.PUBLIC, // 转为公开募资
      });
      if (result) {
        fetchCompletedChallenges(true);
        Alert.alert(t('common.success'), t('myGames.convertSuccess'));
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    }
    setProcessing(false);
    setConvertToPublicModalVisible(false);
    setSelectedMatchId(null);
  }, [selectedMatchId, fetchCompletedChallenges, t]);

  const renderItem = useCallback(
    (item: GameMatchPageDto) => {
      const status = getStatusText(item.isEnabled);
      const showProfitBtn = item.isEnabled === ChallengeStatus.ENDED || item.isEnabled === ChallengeStatus.COMPLETED;
      const showEditBtn = item.isEnabled === ChallengeStatus.IN_PROGRESS && isOperationAdmin;
      // 判断挑战是否可以结束
      const canEndChallenge =
        isInvestmentManager &&
        (item.isEnabled === ChallengeStatus.IN_PROGRESS ||
          item.isEnabled === ChallengeStatus.FUNDRAISING ||
          item.isEnabled === ChallengeStatus.FUNDRAISING_COMPLETED);

      // 判断是否显示转公开按钮：投资公司管理员 && 募资中 && 定向募资
      const canConvertToPublic =
        isInvestmentManager &&
        item.isEnabled === ChallengeStatus.FUNDRAISING &&
        item.contributionType === FundraisingType.TARGETED;

      return (
        <View style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <CustomText style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
              {item.name || '-'}
            </CustomText>
            {item.raceName && (
              <CustomText style={[styles.itemName, { fontSize: 14 }]} numberOfLines={1} ellipsizeMode="tail">
                {item.raceName}
              </CustomText>
            )}
            <View style={[styles.statusTag, { backgroundColor: status.color + '20' }]}>
              <CustomText style={[styles.statusText, { color: status.color }]}>{status.text}</CustomText>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleChallengeDetail(item)}>
            <View style={styles.itemContent}>
              <View style={styles.itemLine}>
                <View style={styles.itemRow}>
                  <CustomText style={styles.label}>{t('myGames.challengeTime')}:</CustomText>
                  <CustomText style={styles.value}>{item.gameDate || '-'}</CustomText>
                </View>
                <View style={styles.itemRow}>
                  <CustomText style={styles.label}>{t('myGames.challengeLocation')}:</CustomText>
                  <CustomText style={styles.value}>{item.addressName}</CustomText>
                </View>
              </View>
              <View style={styles.itemLine}>
                <View style={styles.itemRow}>
                  <CustomText style={styles.label}>{t('myGames.pitcher')}:</CustomText>
                  <CustomText style={styles.value}>{item.playPersonName || '-'}</CustomText>
                </View>
                <View style={styles.itemRow}>
                  <CustomText style={styles.label}>{t('myGames.recorder')}:</CustomText>
                  <CustomText style={styles.value}>{item.docPersonName || '-'}</CustomText>
                </View>
              </View>
              <View style={styles.itemLine}>
                <View style={styles.itemRow}>
                  <CustomText style={styles.label}>{t('myGames.waterProfit')}:</CustomText>
                  <CustomText style={styles.value}>{item.profitStr || '-'}</CustomText>
                </View>
                <View style={styles.itemRow}>
                  <CustomText style={styles.label}>{t('myGames.turnover')}:</CustomText>
                  <CustomText style={styles.value}>{item.turnOverStr || '-'}</CustomText>
                </View>
              </View>

              <View style={styles.itemLine}>
                <View style={styles.itemRow}>
                  <CustomText style={styles.label}>{t('myGames.fundraisingType')}:</CustomText>
                  <CustomText style={styles.value}>
                    {item.contributionType === FundraisingType.PUBLIC ? t('myGames.public') : t('myGames.targeted')}
                  </CustomText>
                </View>
                {item.isInside === IsInside.OUTSIDE && (
                  <View style={styles.itemRow}>
                    <CustomText style={styles.label}>{t('myGames.isInside')}:</CustomText>
                    <CustomText style={styles.value}>{t('myGames.outside')}</CustomText>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            {canConvertToPublic && (
              <TouchableOpacity
                style={[styles.actionButton, styles.convertToPublicButton]}
                onPress={() => showConvertToPublicConfirm(item.id)}
                disabled={processing}
              >
                <Icon name="public" size={12} color="#fff" style={styles.buttonIcon} />
                <CustomText style={styles.buttonText}>{t('myGames.convertToPublic')}</CustomText>
              </TouchableOpacity>
            )}
            {canEndChallenge && (
              <TouchableOpacity
                style={[styles.actionButton, styles.endChallengeButton]}
                onPress={() => showEndChallengeConfirm(item.id)}
                disabled={processing}
              >
                <Icon name="stop-circle" size={12} color="#fff" style={styles.buttonIcon} />
                <CustomText style={styles.buttonText}>{t('challengeDetail.endChallenge')}</CustomText>
              </TouchableOpacity>
            )}
            {showEditBtn && (
              <TouchableOpacity
                style={[styles.actionButton, styles.restartButton]}
                onPress={() => handleViewRoundDetail(item)}
              >
                <Icon name="refresh" size={12} color="#fff" style={styles.buttonIcon} />
                <CustomText style={styles.buttonText}>{t('myGames.edit')}</CustomText>
              </TouchableOpacity>
            )}

            {showProfitBtn && (
              <TouchableOpacity style={styles.actionButton} onPress={() => handleViewProfit(item)}>
                <CustomText style={styles.buttonText}>{t('myGames.viewProfit')}</CustomText>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton} onPress={() => handleViewContribution(item)}>
              <CustomText style={styles.buttonText}>{t('myGames.viewContribution')}</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [
      handleViewProfit,
      handleViewContribution,
      handleViewRoundDetail,
      handleChallengeDetail,
      showEndChallengeConfirm,
      showConvertToPublicConfirm,
      processing,
      t,
      isOperationAdmin,
      isInvestmentManager,
    ],
  );

  // 渲染列表底部加载状态
  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={THEME_COLORS.primary} />
        <CustomText style={styles.footerText}>{t('common.loading')}</CustomText>
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
        <CustomText style={styles.headerTitle}>{t('myGames.title')}</CustomText>
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
            <CustomText style={styles.emptyText}>{t('myGames.noGames')}</CustomText>
          </View>
        )}
      </View>

      <ProfitModal
        visible={profitModalVisible}
        onClose={handleCloseProfitModal}
        currency={currency}
        profit={selectedProfit}
        loading={detailLoading}
      />

      <ContributionModal
        visible={contributionModalVisible}
        onClose={handleCloseContributionModal}
        currency={currency}
        selectedContribution={selectedContribution}
        loading={detailLoading}
      />

      <ConfirmModal
        visible={confirmModalVisible}
        title={t('challengeDetail.confirmEnd')}
        message={t('challengeDetail.confirmEndMessage')}
        cancelText={t('common.cancel')}
        confirmText={t('challengeDetail.confirmEndAction')}
        onCancel={hideEndChallengeConfirm}
        onConfirm={confirmEndChallenge}
        isProcessing={processing}
      />

      <ConfirmModal
        visible={convertToPublicModalVisible}
        title={t('myGames.convertToPublicTitle')}
        message={t('myGames.convertToPublicMessage')}
        cancelText={t('common.cancel')}
        confirmText={t('myGames.confirmConvert')}
        onCancel={hideConvertToPublicConfirm}
        onConfirm={confirmConvertToPublic}
        isProcessing={processing}
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
    height: 40,
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
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
    paddingBottom: 6,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: THEME_COLORS.text.primary,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 14,
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
    width: 50,
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
    fontSize: 14,
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
  endChallengeButton: {
    backgroundColor: THEME_COLORS.danger,
  },
  convertToPublicButton: {
    backgroundColor: '#fa8c16',
  },
});

export default MyGamesScreen;
