import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GameMatchDto } from '../../interface/Game';
import { THEME_COLORS } from '../../utils/styles';
import { getMatchDetail } from '../../api/services/gameService';
import { createContribution, getContributionDetail, deleteContribution } from '../../api/services/contributionService';
import { ContributionDto } from '../../interface/Contribution';
import { useTranslation } from '../../hooks/useTranslation';
import { ChallengeDetailCard } from './components/ChallengeDetailCard';
import { ContributionList } from './components/ContributionList';
import ConfirmModal from '../../components/ConfirmModal';
import CustomText from '../../components/CustomText';
import { RootStackScreenProps } from '../router';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';

type InvestmentDetailScreenProps = RootStackScreenProps<'InvestmentDetail'>;

export const InvestmentDetailScreen: React.FC<InvestmentDetailScreenProps> = React.memo((props) => {
  const { navigation, route } = props;
  const { matchId } = route.params;
  const { t } = useTranslation();
  const [matchDetail, setMatchDetail] = useState<GameMatchDto | null>(null);
  const [myContribution, setMyContribution] = useState<ContributionDto | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取挑战详情
  const fetchChallengeDetail = useCallback(async () => {
    setLoading(true);
    const detail = await getMatchDetail(matchId);
    if (detail) {
      setMatchDetail(detail);
    }
    setLoading(false);
  }, [matchId]);

  // 获取本人出资信息
  const fetchMyContributionDetail = useCallback(async () => {
    const contributionDetail = await getContributionDetail(matchId);
    setMyContribution(contributionDetail);
  }, [matchId]);

  // 初始加载数据
  useEffect(() => {
    fetchChallengeDetail();
    fetchMyContributionDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAmountChange = useCallback((text: string) => {
    setAmount(text);
  }, []);

  // 处理出资
  const handleInvest = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert(t('fundraisingChallenge.hint'), t('fundraisingChallenge.invalidAmount'));
      return;
    }
    const amountValue = parseFloat(amount);
    const availableAmount = matchDetail?.availableAmount || 0;
    if (amountValue > availableAmount) {
      Alert.alert(t('fundraisingChallenge.hint'), t('fundraisingChallenge.amountExceedsLimit'));
      return;
    }

    // 校验出资额必须为10000的倍数
    if (amountValue % 100 !== 0) {
      Alert.alert(t('fundraisingChallenge.hint'), t('fundraisingChallenge.amountMustBeMultiple'));
      return;
    }

    setSubmitting(true);
    try {
      const result = await createContribution({
        matchId,
        amount: amountValue,
      });
      if (result) {
        setMyContribution(result);
        setAmount('');
        fetchChallengeDetail();
        Alert.alert(t('fundraisingChallenge.success'), t('fundraisingChallenge.investSuccess'));
      }
    } catch (error: any) {
      Alert.alert(t('fundraisingChallenge.error'), error?.message);
    }
    setSubmitting(false);
  }, [amount, matchDetail, matchId, fetchChallengeDetail, t]);

  // 打开删除确认模态框
  const handleShowDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  // 关闭删除确认模态框
  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  // 确认删除
  const handleConfirmDelete = useCallback(async () => {
    if (!myContribution?.id) {
      return;
    }
    setSubmitting(true);

    const result = await deleteContribution(myContribution.id);
    if (result) {
      fetchChallengeDetail();
      fetchMyContributionDetail();
      Alert.alert(t('fundraisingChallenge.success'), t('fundraisingChallenge.deleteSuccess'));
    } else {
      Alert.alert(t('fundraisingChallenge.error'), t('fundraisingChallenge.deleteError'));
    }
    setSubmitting(false);
    setShowDeleteModal(false);
  }, [myContribution?.id, fetchChallengeDetail, fetchMyContributionDetail, t]);

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 判断是否可以投资
  const isAvailableForInvest = useMemo(
    () => matchDetail?.availableAmount && matchDetail.availableAmount > 0,
    [matchDetail?.availableAmount],
  );

  // 判断是否已有出资
  const hasContribution = useMemo(() => !!myContribution?.amount, [myContribution]);

  // 判断是否能够删除出资（只有在挑战募资未结束时才能删除）
  const canDeleteContribution = useMemo(
    () => isAvailableForInvest && hasContribution,
    [isAvailableForInvest, hasContribution],
  );

  const renderMyContribution = useCallback(() => {
    return (
      <View style={styles.myContributionCard}>
        <View style={styles.myContributionInfo}>
          <CustomText style={styles.cardTitle}>{t('fundraisingChallenge.myContribution')}:</CustomText>
          <CustomText style={styles.myContributionAmount}>{myContribution?.amount}</CustomText>
        </View>

        {canDeleteContribution ? (
          <TouchableOpacity style={styles.deleteButton} onPress={handleShowDeleteModal} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <CustomText style={styles.deleteButtonText}>{t('fundraisingChallenge.delete')}</CustomText>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }, [myContribution?.amount, canDeleteContribution, handleShowDeleteModal, submitting, t]);

  const renderInvestForm = useCallback(() => {
    return (
      <View style={styles.investFormCard}>
        <CustomText style={styles.cardTitle}>
          {t('fundraisingChallenge.investAmount')}
          <CustomText style={{ color: '#F9230C' }}>{matchDetail?.currency && `(${matchDetail?.currency})`}</CustomText>
        </CustomText>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={handleAmountChange}
          placeholder={t('fundraisingChallenge.enterAmount')}
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        <CustomText style={styles.amountHint}>
          {t('fundraisingChallenge.availableAmountLabel')}：{matchDetail?.availableAmount || 0}
        </CustomText>

        <TouchableOpacity
          style={[styles.investSubmitButton, !isAvailableForInvest && styles.disabledButton]}
          onPress={handleInvest}
          disabled={submitting || !isAvailableForInvest}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <CustomText style={styles.investSubmitButtonText}>{t('fundraisingChallenge.confirmInvest')}</CustomText>
          )}
        </TouchableOpacity>
      </View>
    );
  }, [
    t,
    amount,
    handleAmountChange,
    handleInvest,
    isAvailableForInvest,
    matchDetail?.availableAmount,
    matchDetail?.currency,
    submitting,
  ]);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={THEME_COLORS.primary} />
            <CustomText style={styles.loadingText}>{t('fundraisingChallenge.loading')}</CustomText>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
          </TouchableOpacity>
          <CustomText style={styles.detailTitle}>挑战出资</CustomText>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.detailContent}>
          <ChallengeDetailCard matchDetail={matchDetail} />
          {hasContribution ? renderMyContribution() : renderInvestForm()}
          <ContributionList contributions={matchDetail?.contributionDtoList} matchDetail={matchDetail} />
        </View>

        {/* 删除确认模态框 */}
        <ConfirmModal
          visible={showDeleteModal}
          title="删除出资"
          message="您确定要删除此出资吗？"
          cancelText="取消"
          confirmText="确认删除"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          isProcessing={submitting}
        />
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerRight: {
    width: 40,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  detailContent: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  myContributionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 10,
    marginBottom: 8,
  },
  myContributionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
    marginRight: 4,
  },
  myContributionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
  },
  deleteButton: {
    backgroundColor: THEME_COLORS.danger || '#ff4d4f',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  investFormCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 10,
    marginBottom: 8,
  },
  amountInput: {
    height: 44,
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 15,
    backgroundColor: '#f5f5f5',
    marginTop: 5,
  },
  amountHint: {
    marginVertical: 4,
    fontSize: 13,
    color: THEME_COLORS.success,
  },
  investSubmitButton: {
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 6,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  investSubmitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
