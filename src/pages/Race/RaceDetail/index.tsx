import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { RootStackScreenProps } from '../../router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getRaceDetail } from '../../../api/services/raceService';
import { STATUS_BAR_HEIGHT, isIOS } from '../../../utils/platform';
import { THEME_COLORS } from '../../../utils/styles';
import { getRaceStatusText } from '../../../public/Race';
import { useRole } from '../../../hooks/useRole';
import { useTranslation } from '../../../hooks/useTranslation';
import { PoolInfoCard } from './components/PoolInfoCard';
import { ChallengeList } from './components/ChallengeList';
import { RacePeakRecordCard } from './components/RacePeakRecordCard';
import CustomText from '../../../components/CustomText';
import { GameMatchSimpleDto } from '../../../interface/Ranking';
import { RaceDetailDto } from '../../../interface/Race';

export const RaceDetailScreen: React.FC<RootStackScreenProps<'RaceDetail'>> = React.memo(({ navigation, route }) => {
  const { raceId } = route.params;
  const [raceDetail, setRaceDetail] = useState<RaceDetailDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isInvestmentManager } = useRole();
  const { t } = useTranslation();

  // 获取比赛详情数据
  const fetchRaceDetail = useCallback(async () => {
    setLoading(true);
    const res = await getRaceDetail(String(raceId));
    if (res) {
      setRaceDetail(res);
    }
    setLoading(false);
  }, [raceId]);

  useEffect(() => {
    fetchRaceDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 发起挑战
  const handleStartChallenge = useCallback(() => {
    if (isInvestmentManager) {
      navigation.navigate('NewChallenge', { raceId });
    }
  }, [navigation, raceId, isInvestmentManager]);

  // 跳转到挑战详情
  const handleChallengePress = useCallback(
    (item: GameMatchSimpleDto) => {
      navigation.navigate('ChallengeDetail', { matchId: item.id });
    },
    [navigation],
  );

  // 渲染比赛状态标签
  const renderStatusTag = useCallback((status: number | undefined) => {
    const statusInfo = getRaceStatusText(status || 0);
    return (
      <View style={[styles.statusTag, { backgroundColor: statusInfo.color + '20' }]}>
        <CustomText style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</CustomText>
      </View>
    );
  }, []);

  // 渲染加载中状态
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>{t('raceDetail.title')}</CustomText>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <CustomText style={styles.loadingText}>{t('raceDetail.loading')}</CustomText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('raceDetail.title')}</CustomText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {raceDetail ? (
          <>
            <View style={styles.detailCard}>
              <View style={styles.cardHeader}>
                <CustomText style={styles.raceName} numberOfLines={1} ellipsizeMode="tail">
                  {raceDetail.name || '-'}
                </CustomText>
                {renderStatusTag(raceDetail.isEnabled)}
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <CustomText style={styles.label}>{t('raceDetail.startTime')}:</CustomText>
                  <CustomText style={styles.value}>{raceDetail.beginDate || '-'}</CustomText>
                </View>
                <View style={styles.infoRow}>
                  <CustomText style={styles.label}>{t('raceDetail.endTime')}:</CustomText>
                  <CustomText style={styles.value}>{raceDetail.endDate || '-'}</CustomText>
                </View>
                <View style={styles.infoRow}>
                  <CustomText style={styles.label}>{t('raceDetail.raceRule')}:</CustomText>
                  <CustomText style={styles.value}>{raceDetail.playRuleName || '-'}</CustomText>
                </View>
                <View style={styles.infoRow}>
                  <CustomText style={styles.label}>{t('raceDetail.turnOverLimit')}:</CustomText>
                  <CustomText style={styles.value}>{raceDetail.turnOverLimit || '-'}</CustomText>
                </View>
                <View style={styles.infoRow}>
                  <CustomText style={styles.label}>{t('raceDetail.description')}:</CustomText>
                  <CustomText style={styles.value}>{raceDetail.description || '-'}</CustomText>
                </View>
              </View>
              {raceDetail.racePoolDetailDto && <PoolInfoCard poolDetail={raceDetail.racePoolDetailDto} />}
            </View>

            {isInvestmentManager && (
              <TouchableOpacity
                style={[styles.actionButton, !isInvestmentManager && styles.disabledButton]}
                onPress={handleStartChallenge}
                activeOpacity={0.7}
              >
                <CustomText style={styles.actionButtonText}>{t('raceDetail.startChallenge')}</CustomText>
              </TouchableOpacity>
            )}

            {raceDetail.peakRecordDto && (
              <View style={styles.peakRecordContainer}>
                {raceDetail.peakRecordDto.maxProfitMatch && (
                  <RacePeakRecordCard matchData={raceDetail.peakRecordDto.maxProfitMatch} recordType="profit" />
                )}
                {raceDetail.peakRecordDto.maxProfitMatch && raceDetail.peakRecordDto.maxInningCountMatch && (
                  <View style={styles.peakCardSpacer} />
                )}
                {raceDetail.peakRecordDto.maxInningCountMatch && (
                  <RacePeakRecordCard matchData={raceDetail.peakRecordDto.maxInningCountMatch} recordType="count" />
                )}
              </View>
            )}

            {raceDetail?.gameMatchSimpleDtoList?.length && (
              <View style={styles.challengeSection}>
                <CustomText style={styles.sectionTitle}>{t('raceDetail.profitRanking')}</CustomText>
                <ChallengeList challenges={raceDetail.gameMatchSimpleDtoList} onPressItem={handleChallengePress} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>{t('raceDetail.noRaceInfo')}</CustomText>
          </View>
        )}
      </ScrollView>
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
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 10,
  },
  detailCard: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
    marginBottom: 5,
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
  },
  raceName: {
    fontSize: 18,
    fontWeight: '600',
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
  infoSection: {
    paddingTop: 8,
  },
  infoRow: {
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
  actionButton: {
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: THEME_COLORS.text.light,
    marginTop: 10,
  },
  emptyContainer: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: THEME_COLORS.text.light,
  },
  peakRecordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  peakCardSpacer: {
    width: 10,
  },
  challengeSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
    marginBottom: 5,
    paddingHorizontal: 5,
  },
});
