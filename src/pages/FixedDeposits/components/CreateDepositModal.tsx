import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomText from '../../../components/CustomText';
import CustomTextInput from '../../../components/CustomTextInput';
import { SlideModal } from '../../../components/SlideModal';
import PayPasswordInput from '../../PointsTransfer/components/PayPasswordInput';
import { createFixedAccount } from '../../../api/services/accountService';
import { CreateFixAccountParams } from '../../../interface/Account';

interface CreateDepositModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availablePoints: number;
}

const CreateDepositModal = React.memo((props: CreateDepositModalProps) => {
  const { visible, onClose, onSuccess, availablePoints } = props;
  const { t } = useTranslation();

  const [depositName, setDepositName] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [payPassword, setPayPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayPassword, setShowPayPassword] = useState(false);

  const handleClose = useCallback(() => {
    setDepositName('');
    setDepositAmount('');
    setPayPassword('');
    setIsSubmitting(false);
    setShowPayPassword(false);
    onClose();
  }, [onClose]);

  const handleNext = useCallback(() => {
    // 验证输入
    if (!depositName.trim()) {
      Alert.alert(t('common.error'), t('fixedDeposits.nameRequired'));
      return;
    }

    if (!depositAmount.trim()) {
      Alert.alert(t('common.error'), t('fixedDeposits.amountRequired'));
      return;
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount < 100) {
      Alert.alert(t('common.error'), t('fixedDeposits.amountInvalid'));
      return;
    }

    // 验证定存数量不能超过可用积分
    if (amount > availablePoints) {
      Alert.alert(t('common.error'), t('fixedDeposits.amountExceedsAvailable'));
      return;
    }

    // 验证通过，显示支付密码输入
    setShowPayPassword(true);
  }, [depositName, depositAmount, availablePoints, t]);

  const handleSubmit = useCallback(async () => {
    // 验证支付密码
    if (!payPassword || payPassword.length !== 6) {
      Alert.alert(t('common.error'), t('pointsTransfer.payPasswordRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      const amount = parseFloat(depositAmount);
      // 构建请求参数
      const params: CreateFixAccountParams = {
        name: depositName.trim(),
        amount: amount,
        payPassword: payPassword,
      };

      await createFixedAccount(params);

      Alert.alert(t('common.success'), t('fixedDeposits.createSuccess'), [
        {
          text: t('common.ok'),
          onPress: () => {
            handleClose();
            onSuccess();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(t('common.error'), error?.message);
    }
    setIsSubmitting(false);
  }, [depositName, depositAmount, payPassword, t, handleClose, onSuccess]);

  const handleBackToForm = useCallback(() => {
    setShowPayPassword(false);
    setPayPassword('');
  }, []);

  return (
    <SlideModal visible={visible} onClose={handleClose} title={t('fixedDeposits.createTitle')}>
      {!showPayPassword ? (
        <View style={styles.modalContent}>
          <>
            {/* 显示可用积分 */}
            <View style={styles.availablePointsContainer}>
              <CustomText style={styles.availablePointsText}>
                {t('fixedDeposits.availablePoints')}: {availablePoints.toLocaleString()}
              </CustomText>
            </View>

            <View style={styles.inputGroup}>
              <CustomText style={styles.inputLabel}>{t('fixedDeposits.depositName')}</CustomText>
              <CustomTextInput
                value={depositName}
                onChangeText={setDepositName}
                placeholder={t('fixedDeposits.namePlaceholder')}
                placeholderTextColor="#999999"
                style={styles.modalInput}
              />
            </View>
            <View style={styles.inputGroup}>
              <CustomText style={styles.inputLabel}>{t('fixedDeposits.depositAmount')}</CustomText>
              <CustomTextInput
                value={depositAmount}
                onChangeText={setDepositAmount}
                placeholder={t('fixedDeposits.amountPlaceholder')}
                placeholderTextColor="#999999"
                keyboardType="numeric"
                style={styles.modalInput}
              />
            </View>
          </>
          <TouchableOpacity style={styles.confirmButton} onPress={handleNext}>
            <CustomText style={styles.confirmButtonText}>{t('common.next')}</CustomText>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* 支付密码输入界面 */}
          <View style={styles.payPasswordContainer}>
            <CustomText style={styles.payPasswordTitle}>{t('pointsTransfer.payPassword')}</CustomText>
            <PayPasswordInput value={payPassword} onChangeText={setPayPassword} style={styles.payPasswordInput} />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackToForm}>
                <CustomText style={styles.backButtonText}>{t('common.back')}</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                <CustomText style={styles.submitButtonText}>
                  {isSubmitting ? t('common.loading') : t('common.confirm')}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SlideModal>
  );
});

const styles = StyleSheet.create({
  modalContent: {
    padding: 16,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  availablePointsContainer: {
    backgroundColor: '#f5f3fe',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  availablePointsText: {
    fontSize: 14,
    color: '#6c5ce7',
    fontWeight: '500',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  confirmButton: {
    backgroundColor: '#6c5ce7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 50,
  },
  disabledButton: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  payPasswordContainer: { padding: 16, alignItems: 'center', flex: 1 },
  payPasswordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  payPasswordInput: {
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#6c5ce7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export { CreateDepositModal };
