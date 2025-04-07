import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMatchDetail, updateMatchStatus } from '../../api/services/gameService';
import { GameMatchDto, GameRoundDto } from '../../interface/Game';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { ChallengeStatus } from '../../interface/Common';
import { useRole } from '../../hooks/useRole';
import { THEME_COLORS } from '../../utils/styles';
import ConfirmModal from '../../components/ConfirmModal';
import { RoundItem } from './components/RoundItem';
import { FundraisingInfo } from './components/FundraisingInfo';
import { RootStackScreenProps } from '../router';

// 使用导航堆栈中定义的类型
type ChallengeDetailScreenProps = RootStackScreenProps<'ChallengeDetail'>;

export const ChallengeDetail: React.FC<ChallengeDetailScreenProps> = React.memo(({ navigation, route }) => {
  const { matchId } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [matchDetail, setMatchDetail] = useState<GameMatchDto | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const { isInvestmentManager } = useRole();

  const fetchMatchDetail = useCallback(async () => {
    setLoading(true);
    const res = await getMatchDetail(matchId);
    setLoading(false);
    res && setMatchDetail(res);
  }, [matchId]);

  useEffect(() => {
    fetchMatchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 显示结束挑战确认弹窗
  const showEndChallengeConfirm = useCallback(() => {
    setConfirmModalVisible(true);
  }, []);

  // 隐藏结束挑战确认弹窗
  const hideEndChallengeConfirm = useCallback(() => {
    setConfirmModalVisible(false);
  }, []);

  // 确认结束挑战
  const confirmEndChallenge = useCallback(async () => {
    setProcessing(true);
    const result = await updateMatchStatus({
      id: matchId,
      isEnabled: ChallengeStatus.ENDED, // 设置为已结束状态
    });
    if (result) {
      fetchMatchDetail();
      Alert.alert('操作成功', '挑战已成功结束');
    } else {
      Alert.alert('错误', '操作失败，请重试');
    }
    setProcessing(false);
    setConfirmModalVisible(false);
  }, [matchId, fetchMatchDetail]);

  // 获取状态文本和颜色
  const getStatusInfo = useCallback((status: number): { text: string; color: string } => {
    switch (status) {
      case ChallengeStatus.ENDED:
        return { text: '已结束', color: '#999999' };
      case ChallengeStatus.IN_PROGRESS:
        return { text: '进行中', color: '#1890ff' };
      case ChallengeStatus.FUNDRAISING:
        return { text: '募资中', color: '#52c41a' };
      case ChallengeStatus.FUNDRAISING_COMPLETED:
        return { text: '募资完成', color: '#faad14' };
      case ChallengeStatus.COMPLETED:
        return { text: '已完成', color: '#722ed1' };
      default:
        return { text: '未知', color: '#999999' };
    }
  }, []);

  // 判断挑战是否可以结束
  const canEndChallenge = useMemo(
    () =>
      isInvestmentManager &&
      (matchDetail?.isEnabled === ChallengeStatus.IN_PROGRESS ||
        matchDetail?.isEnabled === ChallengeStatus.FUNDRAISING ||
        matchDetail?.isEnabled === ChallengeStatus.FUNDRAISING_COMPLETED),
    [isInvestmentManager, matchDetail?.isEnabled],
  );

  // 获取当前状态信息
  const statusInfo = useMemo(() => {
    return matchDetail ? getStatusInfo(matchDetail.isEnabled) : { text: '-', color: '#999999' };
  }, [matchDetail, getStatusInfo]);

  // 判断是否显示募资信息
  const showFundraisingInfo = useMemo(() => {
    return matchDetail?.isEnabled === ChallengeStatus.FUNDRAISING;
  }, [matchDetail]);

  const renderRound = useCallback((round: GameRoundDto, index: number) => {
    return <RoundItem key={`round-${round.id || index}`} round={round} index={index} />;
  }, []);

  // 渲染挑战详情
  const renderMatchDetail = useCallback(() => {
    if (!matchDetail) {
      return null;
    }
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.matchInfoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战名称:</Text>
                <Text style={styles.value} numberOfLines={1}>
                  {matchDetail.name || '-'}
                </Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusTag, { backgroundColor: `${statusInfo.color}20` }]}>
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.itemRow}>
                <Text style={styles.label}>记录人:</Text>
                <Text style={styles.value}>{matchDetail.docPersonName || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>投手:</Text>
                <Text style={styles.value}>{matchDetail.playPersonName || '-'}</Text>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.itemRow}>
                <Text style={styles.label}>地点:</Text>
                <Text style={styles.value}>{matchDetail.addressName || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>时间:</Text>
                <Text style={styles.value}>{matchDetail.gameDate || '-'}</Text>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战上下水:</Text>
                <Text style={styles.value}>{matchDetail.profitStr || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战转码:</Text>
                <Text style={styles.value}>{matchDetail.turnOverStr || '-'}</Text>
              </View>
            </View>
          </View>
        </View>
        {showFundraisingInfo && <FundraisingInfo matchDetail={matchDetail} />}
        {canEndChallenge && (
          <View style={styles.endChallengeContainer}>
            <TouchableOpacity style={styles.endChallengeButton} onPress={showEndChallengeConfirm} disabled={processing}>
              <Icon name="stop-circle" size={18} color="#fff" style={styles.endButtonIcon} />
              <Text style={styles.endChallengeButtonText}>结束挑战</Text>
            </TouchableOpacity>
          </View>
        )}
        {matchDetail?.roundList?.length ? <Text style={styles.sectionTitle}>场次信息</Text> : null}
        <View style={styles.roundsContainer}>{matchDetail.roundList?.map(renderRound)}</View>
      </ScrollView>
    );
  }, [matchDetail, statusInfo, canEndChallenge, processing, showEndChallengeConfirm, renderRound, showFundraisingInfo]);

  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (matchDetail) {
      return renderMatchDetail();
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无挑战详情</Text>
      </View>
    );
  }, [loading, matchDetail, renderMatchDetail]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>挑战详情</Text>
        <View style={styles.headerRight} />
      </View>
      {renderContent()}
      <ConfirmModal
        visible={confirmModalVisible}
        title="确认结束挑战"
        message="确定要结束该挑战吗？此操作不可撤销。"
        cancelText="取消"
        confirmText="确认结束"
        onCancel={hideEndChallengeConfirm}
        onConfirm={confirmEndChallenge}
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
  contentContainer: {
    padding: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  matchInfoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'column',
  },
  infoColumn: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginRight: 2,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  statusContainer: {
    marginLeft: 'auto',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  roundsContainer: {
    marginBottom: 16,
  },
  endChallengeContainer: {
    marginTop: 10,
  },
  endChallengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.danger,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    justifyContent: 'center',
    width: '100%',
  },
  endChallengeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  endButtonIcon: {
    marginRight: 4,
  },
});

export default ChallengeDetail;
