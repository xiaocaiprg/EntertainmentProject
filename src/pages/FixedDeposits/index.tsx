import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../hooks/useAuth';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import CustomText from '../../components/CustomText';
import ConfirmModal from '../../components/ConfirmModal';
import { getFixedAccountList, terminateFixedAccount } from '../../api/services/accountService';
import { FixAccountDto } from '../../interface/Account';
import { RootStackScreenProps } from '../router';
import { CreateDepositModal } from './components/CreateDepositModal';

const FixedDepositsScreen = React.memo((props: RootStackScreenProps<'FixedDeposits'>) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { user } = useAuth();
  const [deposits, setDeposits] = useState<FixAccountDto[]>([]);
  const [loading, setLoading] = useState(false);

  // 新建定存相关状态
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 终止定存相关状态
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<FixAccountDto | null>(null);
  const [isTerminating, setIsTerminating] = useState(false);

  const loadDeposits = useCallback(async () => {
    setLoading(true);
    const data = await getFixedAccountList();
    setDeposits(data);
    setLoading(false);
  }, []);

  const handleCreateNew = useCallback(() => setShowCreateModal(true), []);
  const handleCloseCreateModal = useCallback(() => setShowCreateModal(false), []);
  const handleCreateSuccess = useCallback(() => loadDeposits(), [loadDeposits]);

  const handleTerminate = useCallback((item: FixAccountDto) => {
    setSelectedDeposit(item);
    setShowTerminateModal(true);
  }, []);

  const handleConfirmTerminate = useCallback(async () => {
    if (!selectedDeposit) {
      return;
    }

    setIsTerminating(true);
    try {
      await terminateFixedAccount(selectedDeposit.code);
      Alert.alert(t('common.success'), t('fixedDeposits.terminateSuccess'));
      loadDeposits(); // 刷新列表
      setShowTerminateModal(false);
      setSelectedDeposit(null);
    } catch (error: any) {
      Alert.alert(t('common.error'), error?.message || t('fixedDeposits.terminateFailed'));
    }
    setIsTerminating(false);
  }, [selectedDeposit, t, loadDeposits]);

  const handleCancelTerminate = useCallback(() => {
    setShowTerminateModal(false);
    setSelectedDeposit(null);
    setIsTerminating(false);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) {
      return '-';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }, []);

  const formatAmount = useCallback((amount: number) => {
    if (!amount) {
      return '0';
    }
    return amount.toLocaleString();
  }, []);

  const statusText = useMemo(
    () => ({
      enabled: t('fixedDeposits.enabled'),
      disabled: t('fixedDeposits.disabled'),
    }),
    [t],
  );

  const renderDepositItem = useCallback(
    ({ item }: { item: FixAccountDto }) => (
      <View style={styles.depositItem}>
        <View style={styles.depositHeader}>
          <View style={styles.headerLeft}>
            <CustomText style={styles.accountName}>{item.name || '-'}</CustomText>
            <View style={[styles.statusBadge, item.isEnabled === 1 ? styles.statusEnabled : styles.statusDisabled]}>
              <CustomText style={styles.statusText}>
                {item.isEnabled === 1 ? statusText.enabled : statusText.disabled}
              </CustomText>
            </View>
          </View>

          {/* 只有启用状态的定存才显示终止按钮 */}
          {item.isEnabled === 1 && (
            <TouchableOpacity style={styles.terminateButton} onPress={() => handleTerminate(item)}>
              <CustomText style={styles.terminateButtonText}>{t('fixedDeposits.terminate')}</CustomText>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.depositDetails}>
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>{t('fixedDeposits.amount')}:</CustomText>
            <CustomText style={styles.detailValue}>{formatAmount(item.amount)}</CustomText>
          </View>
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>{t('fixedDeposits.setDate')}:</CustomText>
            <CustomText style={styles.detailValue}>{formatDate(item.setDate)}</CustomText>
          </View>
        </View>
      </View>
    ),
    [t, formatDate, formatAmount, statusText, handleTerminate],
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Icon name="account-balance-wallet" size={60} color="#bdc3c7" />
        <CustomText style={styles.emptyText}>{t('fixedDeposits.noData')}</CustomText>
      </View>
    ),
    [t],
  );

  const renderLoadingState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <CustomText style={styles.emptyText}>{t('fixedDeposits.loading')}</CustomText>
      </View>
    ),
    [t],
  );

  useEffect(() => {
    loadDeposits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('fixedDeposits.title')}</CustomText>
        <View style={styles.placeholder} />
      </View>

      {/* Action Area */}
      <View style={styles.actionArea}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
          <Icon name="add" size={20} color="#fff" />
          <CustomText style={styles.createButtonText}>{t('fixedDeposits.createNew')}</CustomText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          renderLoadingState()
        ) : (
          <FlatList
            data={deposits}
            renderItem={renderDepositItem}
            keyExtractor={(item, index) => `${item.code}_${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={deposits.length === 0 ? styles.emptyContainer : styles.listContainer}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>

      {/* 新建定存弹窗 */}
      <CreateDepositModal
        visible={showCreateModal}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
        availablePoints={user?.availablePoints || 0}
      />

      {/* 终止定存确认弹窗 */}
      <ConfirmModal
        visible={showTerminateModal}
        title={t('fixedDeposits.confirmTerminate')}
        message={t('fixedDeposits.confirmTerminateMessage')}
        confirmText={t('fixedDeposits.confirmTerminate')}
        onCancel={handleCancelTerminate}
        onConfirm={handleConfirmTerminate}
        isProcessing={isTerminating}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
  },
  placeholder: {
    width: 24,
  },
  actionArea: {
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  createButton: {
    backgroundColor: '#6c5ce7',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 15,
  },
  depositItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  depositHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusEnabled: {
    backgroundColor: '#2ecc71',
  },
  statusDisabled: {
    backgroundColor: '#e74c3c',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  depositDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  terminateButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  terminateButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export { FixedDepositsScreen };
