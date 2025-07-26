import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMatchDetail } from '../../../api/services/gameService';
import { GameMatchDto, GameRoundDto } from '../../../interface/Game';
import { STATUS_BAR_HEIGHT, isIOS } from '../../../utils/platform';
import { ChallengeStatus } from '../../../interface/Common';
import CustomText from '../../../components/CustomText';
import { RoundItem } from './components/RoundItem';
import { FundraisingInfo } from './components/FundraisingInfo';
import { StatisticsInfo } from './components/StatisticsInfo';
import { ImageGallery } from './components/ImageGallery';
import { RootStackScreenProps } from '../../router';
import { useTranslation } from '../../../hooks/useTranslation';
import { useRole } from '../../../hooks/useRole';
import ImageUploadModal from '../../../components/ImageUploadModal';

// 使用导航堆栈中定义的类型
type ChallengeDetailScreenProps = RootStackScreenProps<'ChallengeDetail'>;

export const ChallengeDetail: React.FC<ChallengeDetailScreenProps> = React.memo(({ navigation, route }) => {
  const { matchId } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [matchDetail, setMatchDetail] = useState<GameMatchDto | null>(null);
  const { t } = useTranslation();
  const { isRecorder } = useRole();
  const [imageUploadModalVisible, setImageUploadModalVisible] = useState(false);

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

  const handleOpenImageUpload = useCallback(() => {
    setImageUploadModalVisible(true);
  }, []);

  const handleCloseImageUpload = useCallback(() => {
    setImageUploadModalVisible(false);
  }, []);

  const handleUpload = useCallback(() => {
    setImageUploadModalVisible(false);
    fetchMatchDetail();
  }, [fetchMatchDetail]);

  // 获取状态文本和颜色
  const getStatusInfo = useCallback(
    (status: number): { text: string; color: string } => {
      switch (status) {
        case ChallengeStatus.ENDED:
          return { text: t('challenge.status.ended'), color: '#999999' };
        case ChallengeStatus.IN_PROGRESS:
          return { text: t('challenge.status.inProgress'), color: '#1890ff' };
        case ChallengeStatus.FUNDRAISING:
          return { text: t('challenge.status.fundraising'), color: '#52c41a' };
        case ChallengeStatus.FUNDRAISING_COMPLETED:
          return { text: t('challenge.status.fundraisingCompleted'), color: '#faad14' };
        case ChallengeStatus.COMPLETED:
          return { text: t('challenge.status.completed'), color: '#722ed1' };
        default:
          return { text: t('challenge.status.unknown'), color: '#999999' };
      }
    },
    [t],
  );

  // 获取当前状态信息
  const statusInfo = useMemo(() => {
    return matchDetail ? getStatusInfo(matchDetail.isEnabled) : { text: '-', color: '#999999' };
  }, [matchDetail, getStatusInfo]);

  // 判断是否显示募资信息
  const showFundraisingInfo = useMemo(() => {
    return (
      matchDetail?.isEnabled === ChallengeStatus.FUNDRAISING ||
      matchDetail?.isEnabled === ChallengeStatus.FUNDRAISING_COMPLETED
    );
  }, [matchDetail]);

  const renderRound = useCallback(
    (round: GameRoundDto, index: number) => {
      return (
        <RoundItem
          key={`round-${round.id || index}`}
          playRuleCode={matchDetail?.playRuleCode || ''}
          round={round}
          index={index}
        />
      );
    },
    [matchDetail?.playRuleCode],
  );

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
                <CustomText style={styles.label}>{t('challengeDetail.challengeName')}:</CustomText>
                <CustomText style={styles.value} numberOfLines={1}>
                  {matchDetail.name || '-'}
                </CustomText>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusTag, { backgroundColor: `${statusInfo.color}20` }]}>
                    <CustomText style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</CustomText>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>{t('challengeDetail.recorder')}:</CustomText>
                <CustomText style={styles.value}>{matchDetail.docPersonName || '-'}</CustomText>
              </View>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>{t('challengeDetail.pitcher')}:</CustomText>
                <CustomText style={styles.value}>{matchDetail.playPersonName || '-'}</CustomText>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>{t('challengeDetail.location')}:</CustomText>
                <CustomText style={styles.value}>{matchDetail.addressName || '-'}</CustomText>
              </View>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>{t('challengeDetail.time')}:</CustomText>
                <CustomText style={styles.value}>{matchDetail.gameDate || '-'}</CustomText>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>{t('challengeDetail.waterProfit')}:</CustomText>
                <CustomText style={styles.value}>{matchDetail.profitStr || '-'}</CustomText>
              </View>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>{t('challengeDetail.turnover')}:</CustomText>
                <CustomText style={styles.value}>{matchDetail.turnOverStr || '-'}</CustomText>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>{t('challengeDetail.currency')}:</CustomText>
                <CustomText style={styles.value}>{matchDetail.currency || '-'}</CustomText>
              </View>
            </View>
          </View>
        </View>
        {showFundraisingInfo && <FundraisingInfo matchDetail={matchDetail} />}

        {matchDetail?.gameMatchStatisticDto ? (
          <>
            <CustomText style={styles.sectionTitle}>{t('challengeDetail.statisticsInfo')}</CustomText>
            <StatisticsInfo gameMatchStatisticDto={matchDetail.gameMatchStatisticDto} />
          </>
        ) : null}

        {matchDetail?.roundList?.length ? (
          <CustomText style={styles.sectionTitle}>{t('challengeDetail.roundInfo')}</CustomText>
        ) : null}
        <View style={styles.roundsContainer}>{matchDetail.roundList?.map(renderRound)}</View>

        <ImageGallery fileUrlList={matchDetail.fileUrlList} />

        {isRecorder && (
          <View style={styles.uploadContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleOpenImageUpload}>
              <Icon name="photo-camera" size={20} color="#fff" style={styles.uploadIcon} />
              <CustomText style={styles.uploadText}>{t('myGames.uploadImage')}</CustomText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  }, [matchDetail, statusInfo, renderRound, showFundraisingInfo, t, isRecorder, handleOpenImageUpload]);

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
        <CustomText style={styles.emptyText}>{t('challengeDetail.noDetail')}</CustomText>
      </View>
    );
  }, [loading, matchDetail, renderMatchDetail, t]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('challengeDetail.detail')}</CustomText>
        <View style={styles.headerRight} />
      </View>
      {renderContent()}
      <ImageUploadModal
        visible={imageUploadModalVisible}
        onClose={handleCloseImageUpload}
        matchId={matchId}
        onUploadSuccess={handleUpload}
        onUploadFail={handleUpload}
        existingImages={matchDetail?.fileUrlList}
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
    width: 65,
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
    marginBottom: 10,
  },
  uploadContainer: {
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#5a9e6f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ChallengeDetail;
