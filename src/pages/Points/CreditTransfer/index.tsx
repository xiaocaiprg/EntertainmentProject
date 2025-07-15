import React, { useState, useCallback, useMemo } from 'react';
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
import { useTranslation } from '../../../hooks/useTranslation';
import { RootStackScreenProps } from '../../router';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { useAuth } from '../../../hooks/useAuth';
import { transferCreditPoint } from '../../../api/services/pointService';
import { AccountInputWithHistory } from '../../../bizComponents/AccountInputWithHistory';
import { TransferCreditPointParams, TransferCreateParam } from '../../../interface/Points';
import { isIOS } from '../../../utils/platform';
import { STATUS_BAR_HEIGHT } from '../../../utils/platform';
import CustomText from '../../../components/CustomText';
import { getUserDetail } from '../../../api/services/authService';
import { LoginResultDto } from '../../../interface/User';
import PayPasswordInput from '../../../bizComponents/PayPasswordInput';
import { UserTransferType } from '../../../interface/Common';
import { TransferType } from '../PointsTransfer/index';

export enum CreditTransferType {
  PERSONAL = 'personal',
  COMPANY = 'company',
  GROUP = 'group',
}

type CreditTransferScreenProps = RootStackScreenProps<'CreditTransfer'>;

// 常量定义
const PAY_PASSWORD_LENGTH = 6;

// 工具函数：根据转账类型获取对应的用户类型
const getTransferUserType = (transferType: CreditTransferType): UserTransferType => {
  switch (transferType) {
    case CreditTransferType.PERSONAL:
      return UserTransferType.PERSONAL;
    case CreditTransferType.COMPANY:
      return UserTransferType.COMPANY;
    case CreditTransferType.GROUP:
      return UserTransferType.GROUP;
    default:
      return UserTransferType.PERSONAL;
  }
};

// 工具函数：根据转账类型获取对应的占位符文本
const getPlaceholderText = (transferType: CreditTransferType, t: (key: string) => string): string => {
  switch (transferType) {
    case CreditTransferType.PERSONAL:
      return t('creditTransfer.personalAccountPlaceholder');
    case CreditTransferType.COMPANY:
      return t('creditTransfer.companyAccountPlaceholder');
    case CreditTransferType.GROUP:
      return t('creditTransfer.groupAccountPlaceholder');
    default:
      return t('creditTransfer.personalAccountPlaceholder');
  }
};

// 工具函数：将CreditTransferType映射到TransferType
const mapCreditTransferTypeToTransferType = (
  creditTransferType: CreditTransferType,
): Exclude<TransferType, TransferType.POOL> => {
  switch (creditTransferType) {
    case CreditTransferType.PERSONAL:
      return TransferType.PERSONAL;
    case CreditTransferType.COMPANY:
      return TransferType.COMPANY;
    case CreditTransferType.GROUP:
      return TransferType.GROUP;
    default:
      return TransferType.PERSONAL;
  }
};

export const CreditTransferScreen: React.FC<CreditTransferScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { user } = useAuth();

  const [transferType, setTransferType] = useState<CreditTransferType>(CreditTransferType.PERSONAL);
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recipientDetail, setRecipientDetail] = useState<LoginResultDto | null>(null);
  const [isLoadingRecipient, setIsLoadingRecipient] = useState(false);
  const [payPassword, setPayPassword] = useState('');

  const handleTypeChange = useCallback(
    (newType: CreditTransferType) => {
      if (newType !== transferType) {
        setTransferType(newType);
        setAccount('');
        setAmount('');
        setDescription('');
        setPayPassword('');
      }
    },
    [transferType],
  );

  const confirmTransferInfo = useMemo(() => {
    if (recipientDetail) {
      return {
        code: recipientDetail.code,
        name: recipientDetail.name,
        amount,
      };
    } else {
      return {
        code: account,
        name: '',
        amount,
      };
    }
  }, [recipientDetail, account, amount]);

  const isFormValid = useMemo(() => {
    const condition = amount.trim() !== '' && !isNaN(Number(amount)) && Number(amount) > 0;
    const creditCondition =
      !!user?.creditAccount?.availablePoints && Number(amount) <= user.creditAccount.availablePoints;
    return condition && account.trim() !== '' && creditCondition;
  }, [account, amount, user?.creditAccount?.availablePoints]);

  const invalidAmountReason = useMemo(() => {
    if (amount.trim() === '') {
      return '';
    }
    if (isNaN(Number(amount))) {
      return t('creditTransfer.invalidNumber');
    }
    if (amount.includes('.')) {
      return t('creditTransfer.integerOnly');
    }
    if (Number(amount) <= 0) {
      return t('creditTransfer.moreThanZero');
    }
    if (!user?.creditAccount?.availablePoints || Number(amount) > user.creditAccount.availablePoints) {
      return t('creditTransfer.notEnoughCredit');
    }
    return '';
  }, [amount, user?.creditAccount?.availablePoints, t]);

  const handleTransferPress = useCallback(async () => {
    if (!isFormValid) {
      return;
    }

    setIsLoadingRecipient(true);
    try {
      const detail = await getUserDetail({
        code: account,
        userType: getTransferUserType(transferType),
      });
      if (detail) {
        setRecipientDetail(detail);
        setPayPassword('');
        setConfirmModalVisible(true);
      }
    } catch (err: any) {
      Alert.alert('提示', err.message);
    }
    setIsLoadingRecipient(false);
  }, [isFormValid, transferType, account]);

  const handleConfirmTransfer = useCallback(async () => {
    if (payPassword.length !== PAY_PASSWORD_LENGTH) {
      return;
    }

    setIsProcessing(true);

    const transfer: TransferCreateParam = {
      toCode: recipientDetail?.creditAccount?.code || account,
      toType: UserTransferType.CREDIT_TRANSFER,
      amount: Number(amount),
    };

    // 如果有备注，添加到参数中
    if (description.trim()) {
      transfer.description = description.trim();
    }

    const transferParams: TransferCreditPointParams = {
      transfer,
      payPassword,
    };

    try {
      const res = await transferCreditPoint(transferParams);
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
  }, [account, amount, description, recipientDetail, payPassword]);

  const handleSuccessConfirm = useCallback(() => {
    setSuccessModalVisible(false);
    navigation.goBack();
  }, [navigation]);

  // 类型选择器配置
  const typeOptions = useMemo(
    () => [
      { type: CreditTransferType.PERSONAL, label: t('creditTransfer.personal') },
      { type: CreditTransferType.COMPANY, label: t('creditTransfer.company') },
      { type: CreditTransferType.GROUP, label: t('creditTransfer.group') },
    ],
    [t],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('creditTransfer.title')}</CustomText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* 用户额度模块 */}
        <View style={styles.card}>
          <CustomText style={styles.sectionTitle}>{t('creditTransfer.availableCredit')}</CustomText>
          <CustomText style={styles.creditValue}>{user?.creditAccount?.availablePoints?.toLocaleString()}</CustomText>
        </View>

        <View style={styles.card}>
          <CustomText style={styles.sectionTitle}>{t('creditTransfer.transferTo')}</CustomText>
          <View style={styles.typeSelector}>
            {typeOptions.map((option) => (
              <TouchableOpacity
                key={option.type}
                style={[styles.typeButton, transferType === option.type && styles.typeButtonActive]}
                onPress={() => handleTypeChange(option.type)}
              >
                <CustomText style={[styles.typeText, transferType === option.type && styles.typeTextActive]}>
                  {option.label}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <CustomText style={styles.label}>{t('creditTransfer.account')}</CustomText>
            <AccountInputWithHistory
              value={account}
              onChangeText={setAccount}
              transferType={mapCreditTransferTypeToTransferType(transferType)}
              placeholder={getPlaceholderText(transferType, t)}
              t={t}
            />
          </View>

          <View style={styles.inputGroup}>
            <CustomText style={styles.label}>{t('creditTransfer.amount')}</CustomText>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor={'#999'}
              placeholder={t('creditTransfer.amountPlaceholder')}
              keyboardType="numeric"
            />
            {invalidAmountReason ? <CustomText style={styles.errorText}>{invalidAmountReason}</CustomText> : null}
          </View>

          <View style={styles.inputGroup}>
            <CustomText style={styles.label}>{t('creditTransfer.description')}</CustomText>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={'#999'}
              placeholder={t('creditTransfer.descriptionPlaceholder')}
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
            {isLoadingRecipient ? t('common.loading') : t('creditTransfer.transfer')}
          </CustomText>
        </TouchableOpacity>
      </ScrollView>

      {/* 确认转账弹窗 */}
      <ConfirmModal
        visible={confirmModalVisible}
        title={t('creditTransfer.confirmTitle')}
        message=""
        cancelText={t('common.cancel')}
        confirmText={t('common.confirm')}
        onCancel={() => {
          setConfirmModalVisible(false);
          setPayPassword('');
        }}
        onConfirm={handleConfirmTransfer}
        isProcessing={isProcessing}
        confirmButtonDisabled={payPassword.length !== PAY_PASSWORD_LENGTH}
        customContent={
          <View>
            {/* 转账信息 */}
            <View style={styles.transferInfoContainer}>
              <View style={styles.transferInfoRow}>
                <CustomText style={styles.transferInfoLabel}>{t('creditTransfer.receiverCode')}:</CustomText>
                <CustomText style={styles.transferInfoValue}>{confirmTransferInfo.code}</CustomText>
              </View>
              {confirmTransferInfo.name ? (
                <View style={styles.transferInfoRow}>
                  <CustomText style={styles.transferInfoLabel}>{t('creditTransfer.receiverName')}:</CustomText>
                  <CustomText style={styles.transferInfoValue}>{confirmTransferInfo.name}</CustomText>
                </View>
              ) : null}
              <View style={styles.transferInfoRow}>
                <CustomText style={styles.transferInfoLabel}>{t('creditTransfer.transferAmount')}:</CustomText>
                <CustomText style={styles.transferInfoValue}>
                  {confirmTransferInfo.amount}
                  {t('creditTransfer.creditUnit')}
                </CustomText>
              </View>
            </View>

            {/* 支付密码 */}
            <View style={styles.payPasswordContainer}>
              <CustomText style={styles.payPasswordLabel}>{t('creditTransfer.payPassword')}</CustomText>
              <PayPasswordInput value={payPassword} onChangeText={setPayPassword} />
            </View>

            {/* 提示信息 */}
            <CustomText style={styles.confirmWarning}>{t('creditTransfer.confirmWarning')}</CustomText>
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
        title={t('creditTransfer.success')}
        message={t('creditTransfer.successMessage', { amount })}
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
  headerSpacer: {
    width: 24,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  creditValue: {
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
