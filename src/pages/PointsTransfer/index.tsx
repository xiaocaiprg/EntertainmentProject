import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../hooks/useTranslation';
import { RootStackScreenProps } from '../router';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useAuth } from '../../hooks/useAuth';
import { transferPoint } from '../../api/services/pointService';
import { AccountInputWithHistory } from './components/AccountInputWithHistory';
import { TransferPointParams, TransferCreateParam } from '../../interface/Points';
import { isIOS } from '../../utils/platform';
import { STATUS_BAR_HEIGHT } from '../../utils/platform';
import DropdownSelect from '../../components/DropdownSelect';
import { getRacePoolListAll } from '../../api/services/raceService';
import { RacePoolPageDto } from '../../interface/Race';
import CustomText from '../../components/CustomText';
import { getUserDetail } from '../../api/services/authService';
import { LoginResultDto } from '../../interface/User';
import PayPasswordInput from './components/PayPasswordInput';

export enum TransferType {
  PERSONAL = 'personal',
  COMPANY = 'company',
  POOL = 'pool',
}

type PointsTransferScreenProps = RootStackScreenProps<'PointsTransfer'>;

export const PointsTransferScreen: React.FC<PointsTransferScreenProps> = React.memo((props) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { user } = useAuth();
  const { name, availablePoints, code } = route?.params || {};

  const isPoolTransfer = useMemo(() => !!code && availablePoints !== undefined, [code, availablePoints]);

  const [transferType, setTransferType] = useState<TransferType>(TransferType.PERSONAL);
  const [account, setAccount] = useState('');
  const [points, setPoints] = useState('');
  const [description, setDescription] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [poolList, setPoolList] = useState<RacePoolPageDto[]>([]);
  const [selectedPoolCode, setSelectedPoolCode] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoadingPools, setIsLoadingPools] = useState(false);
  const [recipientDetail, setRecipientDetail] = useState<LoginResultDto | null>(null);
  const [isLoadingRecipient, setIsLoadingRecipient] = useState(false);
  const [payPassword, setPayPassword] = useState('');

  useEffect(() => {
    const fetchPoolList = async () => {
      setIsLoadingPools(true);
      const res = await getRacePoolListAll();
      if (res?.length) {
        setPoolList(res);
      } else {
        setPoolList([
          {
            name: '没有可用奖金池',
            code: '',
            availablePoints: 0,
          },
        ]);
      }
      setIsLoadingPools(false);
    };
    if (transferType === TransferType.POOL) {
      fetchPoolList();
    }
  }, [transferType]);

  const handleTypeChange = useCallback(
    (newType: TransferType) => {
      if (newType !== transferType) {
        setTransferType(newType);
        setAccount('');
        setPoints('');
        setDescription('');
        setSelectedPoolCode('');
        setPayPassword('');
      }
    },
    [transferType],
  );

  const handlePoolSelect = useCallback((value: string) => {
    setSelectedPoolCode(value);
  }, []);

  const selectedPool = useMemo(() => {
    return poolList.find((pool) => pool.code === selectedPoolCode);
  }, [poolList, selectedPoolCode]);

  const confirmTransferInfo = useMemo(() => {
    if (transferType === TransferType.POOL) {
      const poolName = selectedPool?.name;
      return {
        code: selectedPoolCode,
        name: poolName,
        points,
      };
    } else if (recipientDetail) {
      return {
        code: account,
        name: recipientDetail.name,
        points,
      };
    } else {
      return {
        code: account,
        name: '',
        points,
      };
    }
  }, [transferType, selectedPool, selectedPoolCode, recipientDetail, account, points]);

  const isFormValid = useMemo(() => {
    const condition = points.trim() !== '' && !isNaN(Number(points)) && Number(points) > 0;
    const userCondition = !!user?.availablePoints && Number(points) <= user.availablePoints;
    if (isPoolTransfer) {
      if (transferType === TransferType.POOL) {
        return condition && selectedPoolCode !== '' && availablePoints && Number(points) <= availablePoints;
      }
      return condition && account.trim() !== '' && availablePoints && Number(points) <= availablePoints;
    }
    if (transferType === TransferType.POOL) {
      return condition && selectedPoolCode !== '' && userCondition;
    }
    return condition && account.trim() !== '' && userCondition;
  }, [account, points, user?.availablePoints, isPoolTransfer, availablePoints, transferType, selectedPoolCode]);

  const invalidPointsReason = useMemo(() => {
    if (points.trim() === '') {
      return '';
    }
    if (isNaN(Number(points))) {
      return t('pointsTransfer.invalidNumber');
    }
    if (points.includes('.')) {
      return t('pointsTransfer.integerOnly');
    }
    if (Number(points) <= 0) {
      return t('pointsTransfer.moreThanZero');
    }
    if (!isPoolTransfer && (!user?.availablePoints || Number(points) > user.availablePoints)) {
      return t('pointsTransfer.notEnoughPoints');
    }
    if (isPoolTransfer && availablePoints && Number(points) > availablePoints) {
      return t('pointsTransfer.notEnoughPoints');
    }
    return '';
  }, [points, user?.availablePoints, t, isPoolTransfer, availablePoints]);

  const handleTransferPress = useCallback(async () => {
    if (!isFormValid) {
      return;
    }

    // 如果是转给个人或公司，获取接收方详情
    if (transferType !== TransferType.POOL) {
      setIsLoadingRecipient(true);
      try {
        const detail = await getUserDetail({
          code: account,
          type: transferType === TransferType.PERSONAL ? 1 : 2,
        });
        if (detail) {
          setRecipientDetail(detail);
          setConfirmModalVisible(true);
        }
      } catch (err: any) {
        Alert.alert('提示', err.message);
      }
      setIsLoadingRecipient(false);
    } else {
      setConfirmModalVisible(true);
    }
  }, [isFormValid, transferType, account]);

  const handleConfirmTransfer = useCallback(async () => {
    // 如果不是奖金池转账且密码不完整，直接返回
    if (!isPoolTransfer && payPassword.length !== 6) {
      return;
    }

    setIsProcessing(true);

    const transfer: TransferCreateParam = {
      toCode: transferType === TransferType.POOL ? selectedPoolCode : account,
      toType: transferType === TransferType.PERSONAL ? 1 : transferType === TransferType.COMPANY ? 2 : 3,
      amount: Number(points),
    };

    // 如果有备注，添加到参数中
    if (description.trim()) {
      transfer.description = description.trim();
    }

    // 如果是从奖金池转账，添加fromCode和fromType参数
    if (isPoolTransfer && code) {
      transfer.fromCode = code;
      transfer.fromType = 3;
    }

    const transferParams: TransferPointParams = {
      transfer,
      payPassword: isPoolTransfer ? null : payPassword,
    };

    try {
      const res = await transferPoint(transferParams);
      if (res) {
        setSuccessModalVisible(true);
        setPayPassword('');
      }
    } catch (err: any) {
      Alert.alert('提示', err.message);
    } finally {
      setIsProcessing(false);
      setConfirmModalVisible(false);
    }
  }, [account, points, description, transferType, isPoolTransfer, code, selectedPoolCode, payPassword]);

  const handleSuccessConfirm = useCallback(() => {
    setSuccessModalVisible(false);
    navigation.goBack();
  }, [navigation]);

  const renderSelect = useCallback(() => {
    if (transferType === TransferType.POOL) {
      return (
        <View style={styles.inputGroup}>
          <CustomText style={styles.label}>{t('pointsTransfer.poolSelect')}</CustomText>
          {isLoadingPools ? (
            <View style={styles.loadingContainer}>
              <CustomText style={styles.loadingText}>{t('common.loading')}</CustomText>
            </View>
          ) : (
            <>
              <DropdownSelect
                options={poolList}
                valueKey="code"
                labelKey="name"
                selectedValue={selectedPoolCode}
                onSelect={handlePoolSelect}
                placeholder={t('pointsTransfer.poolSelectPlaceholder')}
                isOpen={dropdownOpen}
                onStateChange={setDropdownOpen}
                zIndex={3000}
                zIndexInverse={1000}
                style={{
                  selectContainer: {
                    marginBottom: 0,
                  },
                  dropdown: {
                    backgroundColor: '#fff',
                    minHeight: 40,
                  },
                }}
              />
              {selectedPool?.code && (
                <View style={styles.poolInfoRow}>
                  <CustomText style={styles.poolInfoLabel}>{t('pointsTransfer.availablePoolPoints')}</CustomText>
                  <CustomText style={styles.poolInfoValue}>{selectedPool.availablePoints?.toLocaleString()}</CustomText>
                </View>
              )}
            </>
          )}
        </View>
      );
    }
    return (
      <View style={styles.inputGroup}>
        <CustomText style={styles.label}>{t('pointsTransfer.account')}</CustomText>
        <AccountInputWithHistory
          value={account}
          onChangeText={setAccount}
          transferType={transferType === TransferType.PERSONAL ? TransferType.PERSONAL : TransferType.COMPANY}
          placeholder={
            transferType === TransferType.PERSONAL
              ? t('pointsTransfer.personalAccountPlaceholder')
              : t('pointsTransfer.companyAccountPlaceholder')
          }
          t={t}
        />
      </View>
    );
  }, [
    t,
    transferType,
    account,
    selectedPoolCode,
    poolList,
    selectedPool,
    handlePoolSelect,
    dropdownOpen,
    isLoadingPools,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('pointsTransfer.title')}</CustomText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {isPoolTransfer && (
          <View style={[styles.card, styles.poolCard]}>
            <View style={styles.infoRow}>
              <CustomText style={styles.sectionTitle}>{t('pointsTransfer.poolPoints')}</CustomText>
              <CustomText style={[styles.pointsValue, { fontSize: 15 }]}>
                {availablePoints?.toLocaleString()}
              </CustomText>
            </View>
            {name && (
              <View style={styles.infoRow}>
                <CustomText style={styles.sectionTitle}>{t('pointsTransfer.poolName')}</CustomText>
                <CustomText style={[styles.pointsValue, { fontSize: 15 }]}>{name}</CustomText>
              </View>
            )}
          </View>
        )}

        {/* 用户积分模块，仅在非奖金池转账时展示 */}
        {!isPoolTransfer && (
          <View style={styles.card}>
            <CustomText style={styles.sectionTitle}>{t('pointsTransfer.availablePoints')}</CustomText>
            <CustomText style={styles.pointsValue}>{user?.availablePoints?.toLocaleString()}</CustomText>
          </View>
        )}

        <View style={styles.card}>
          <CustomText style={styles.sectionTitle}>{t('pointsTransfer.transferTo')}</CustomText>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, transferType === TransferType.PERSONAL && styles.typeButtonActive]}
              onPress={() => handleTypeChange(TransferType.PERSONAL)}
            >
              <CustomText style={[styles.typeText, transferType === TransferType.PERSONAL && styles.typeTextActive]}>
                {t('pointsTransfer.personal')}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, transferType === TransferType.COMPANY && styles.typeButtonActive]}
              onPress={() => handleTypeChange(TransferType.COMPANY)}
            >
              <CustomText style={[styles.typeText, transferType === TransferType.COMPANY && styles.typeTextActive]}>
                {t('pointsTransfer.company')}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, transferType === TransferType.POOL && styles.typeButtonActive]}
              onPress={() => handleTypeChange(TransferType.POOL)}
            >
              <CustomText style={[styles.typeText, transferType === TransferType.POOL && styles.typeTextActive]}>
                {t('pointsTransfer.pool')}
              </CustomText>
            </TouchableOpacity>
          </View>
          {renderSelect()}

          <View style={styles.inputGroup}>
            <CustomText style={styles.label}>{t('pointsTransfer.points')}</CustomText>
            <TextInput
              style={styles.input}
              value={points}
              onChangeText={setPoints}
              placeholderTextColor={'#999'}
              placeholder={t('pointsTransfer.pointsPlaceholder')}
              keyboardType="numeric"
            />
            {invalidPointsReason ? <CustomText style={styles.errorText}>{invalidPointsReason}</CustomText> : null}
          </View>

          <View style={styles.inputGroup}>
            <CustomText style={styles.label}>{t('pointsTransfer.description')}</CustomText>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={'#999'}
              placeholder={t('pointsTransfer.descriptionPlaceholder')}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, (!isFormValid || isLoadingRecipient) && styles.submitButtonDisabled]}
          onPress={handleTransferPress}
          disabled={!isFormValid || isLoadingRecipient}
        >
          <CustomText style={styles.submitButtonText}>
            {isLoadingRecipient ? t('common.loading') : t('pointsTransfer.transfer')}
          </CustomText>
        </TouchableOpacity>
      </ScrollView>

      {/* 确认转账弹窗 */}
      <ConfirmModal
        visible={confirmModalVisible}
        title={t('pointsTransfer.confirmTitle')}
        message=""
        cancelText={t('common.cancel')}
        confirmText={t('common.confirm')}
        onCancel={() => {
          setConfirmModalVisible(false);
          if (!isPoolTransfer) {
            setPayPassword('');
          }
        }}
        onConfirm={handleConfirmTransfer}
        isProcessing={isProcessing}
        confirmButtonDisabled={!isPoolTransfer && payPassword.length !== 6}
        customContent={
          <View>
            {/* 转账信息 */}
            <View style={styles.transferInfoContainer}>
              <View style={styles.transferInfoRow}>
                <CustomText style={styles.transferInfoLabel}>{t('pointsTransfer.receiverCode')}:</CustomText>
                <CustomText style={styles.transferInfoValue}>{confirmTransferInfo.code}</CustomText>
              </View>
              {confirmTransferInfo.name ? (
                <View style={styles.transferInfoRow}>
                  <CustomText style={styles.transferInfoLabel}>{t('pointsTransfer.receiverName')}:</CustomText>
                  <CustomText style={styles.transferInfoValue}>{confirmTransferInfo.name}</CustomText>
                </View>
              ) : null}
              <View style={styles.transferInfoRow}>
                <CustomText style={styles.transferInfoLabel}>{t('pointsTransfer.transferAmount')}:</CustomText>
                <CustomText style={styles.transferInfoValue}>
                  {confirmTransferInfo.points}
                  {t('pointsTransfer.pointsUnit')}
                </CustomText>
              </View>
            </View>

            {/* 支付密码 - 仅在非奖金池转账时显示 */}
            {!isPoolTransfer && (
              <View style={styles.payPasswordContainer}>
                <CustomText style={styles.payPasswordLabel}>{t('pointsTransfer.payPassword')}</CustomText>
                <PayPasswordInput value={payPassword} onChangeText={setPayPassword} />
              </View>
            )}

            {/* 提示信息 */}
            <CustomText style={styles.confirmWarning}>{t('pointsTransfer.confirmWarning')}</CustomText>
          </View>
        }
        style={{
          modalMessage: {
            display: 'none',
          },
        }}
      />

      {/* 转账成功弹窗 */}
      <ConfirmModal
        visible={successModalVisible}
        title={t('pointsTransfer.success')}
        message={t('pointsTransfer.successMessage', { points })}
        confirmText={t('common.ok')}
        onConfirm={handleSuccessConfirm}
        style={{
          modalTitle: {
            color: '#6c5ce7',
          },
          confirmButton: {
            width: '100%',
          },
        }}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3fe',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f3fe',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  poolCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  typeSelector: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  typeButtonActive: {
    borderBottomColor: '#6c5ce7',
  },
  typeText: {
    fontSize: 16,
    color: '#999',
  },
  typeTextActive: {
    color: '#6c5ce7',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  descriptionInput: {
    height: 80,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#6c5ce7',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  poolInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 5,
  },
  poolInfoLabel: {
    fontSize: 14,
    color: '#999',
  },
  poolInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  loadingContainer: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  payPasswordLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },
  transferInfoContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  transferInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transferInfoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  transferInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  payPasswordContainer: {
    marginBottom: 2,
  },
  confirmWarning: {
    fontSize: 13,
    color: '#FF0F3C',
    textAlign: 'center',
    lineHeight: 18,
  },
});
