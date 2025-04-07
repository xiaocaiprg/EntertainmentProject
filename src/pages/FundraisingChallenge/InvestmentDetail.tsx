import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GameMatchDto } from '../../interface/Game';
import { THEME_COLORS } from '../../utils/styles';
import { getMatchDetail } from '../../api/services/gameService';
import { createContribution, getContributionDetail, deleteContribution } from '../../api/services/contributionService';
import { ContributionDto } from '../../interface/Contribution';
import { ChallengeDetailCard } from './components/ChallengeDetailCard';
import { ContributionList } from './components/ContributionList';
import ConfirmModal from '../../components/ConfirmModal';

interface InvestmentDetailProps {
  matchId: number;
  onBack: () => void;
}

export const InvestmentDetail: React.FC<InvestmentDetailProps> = React.memo((props) => {
  const { matchId, onBack } = props;
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
      Alert.alert('提示', '请输入有效的出资金额');
      return;
    }

    const amountValue = parseFloat(amount);
    const availableAmount = matchDetail?.availableAmount || 0;

    if (amountValue > availableAmount) {
      Alert.alert('提示', '出资金额不能超过可出资金额');
      return;
    }

    // 校验出资额必须为10000的倍数
    if (amountValue % 10000 !== 0) {
      Alert.alert('提示', '出资金额必须为10000的倍数');
      return;
    }

    setSubmitting(true);
    const result = await createContribution({
      matchId,
      amount: amountValue,
    });
    if (result) {
      setMyContribution(result);
      setAmount('');
      fetchChallengeDetail();
      Alert.alert('成功', '出资成功！');
    } else {
      Alert.alert('错误', '出资失败，请稍后重试');
    }
    setSubmitting(false);
  }, [amount, matchDetail, matchId, fetchChallengeDetail]);

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
      Alert.alert('成功', '出资已删除');
    } else {
      Alert.alert('错误', '删除出资失败，请稍后重试');
    }
    setSubmitting(false);
    setShowDeleteModal(false);
  }, [myContribution?.id, fetchChallengeDetail, fetchMyContributionDetail]);

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
          <Text style={styles.cardTitle}>我的出资:</Text>
          <Text style={styles.myContributionAmount}>{myContribution?.amount}</Text>
        </View>

        {canDeleteContribution ? (
          <TouchableOpacity style={styles.deleteButton} onPress={handleShowDeleteModal} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.deleteButtonText}>删除</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }, [myContribution?.amount, canDeleteContribution, handleShowDeleteModal, submitting]);

  const renderInvestForm = useCallback(() => {
    return (
      <View style={styles.investFormCard}>
        <Text style={styles.cardTitle}>出资金额</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={handleAmountChange}
          placeholder="请输入出资金额"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        <Text style={styles.amountHint}>可出资金额：{matchDetail?.availableAmount || 0}</Text>

        <TouchableOpacity
          style={[styles.investSubmitButton, !isAvailableForInvest && styles.disabledButton]}
          onPress={handleInvest}
          disabled={submitting || !isAvailableForInvest}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.investSubmitButtonText}>确认出资</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }, [amount, handleAmountChange, handleInvest, isAvailableForInvest, matchDetail?.availableAmount, submitting]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME_COLORS.primary} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.detailInner}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.detailTitle}>挑战出资</Text>
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
    </View>
  );
});

const styles = StyleSheet.create({
  detailInner: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
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
    padding: 15,
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
