import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
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
import { TransferPointParams } from '../../interface/Points';

enum TransferType {
  PERSONAL = 'personal',
  COMPANY = 'company',
}
type PointsTransferScreenProps = RootStackScreenProps<'PointsTransfer'>;
export const PointsTransferScreen: React.FC<PointsTransferScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { user } = useAuth();

  const [transferType, setTransferType] = useState<TransferType>(TransferType.PERSONAL);
  const [account, setAccount] = useState('');
  const [points, setPoints] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 切换转账类型时清空所有输入
  const handleTypeChange = useCallback(
    (newType: TransferType) => {
      if (newType !== transferType) {
        setTransferType(newType);
        setAccount('');
        setPoints('');
      }
    },
    [transferType],
  );

  const isFormValid = useMemo(() => {
    return (
      account.trim() !== '' &&
      points.trim() !== '' &&
      !isNaN(Number(points)) &&
      Number(points) > 0 &&
      !!user?.availablePoints &&
      Number(points) <= user.availablePoints
    );
  }, [account, points, user?.availablePoints]);

  const invalidPointsReason = useMemo(() => {
    if (points.trim() === '') {
      return '';
    }
    if (isNaN(Number(points))) {
      return t('pointsTransfer.invalidNumber');
    }
    if (Number(points) <= 0) {
      return t('pointsTransfer.moreThanZero');
    }
    if (!user?.availablePoints || Number(points) > user.availablePoints) {
      return t('pointsTransfer.notEnoughPoints');
    }
    return '';
  }, [points, user?.availablePoints, t]);

  const handleTransferPress = useCallback(() => {
    if (!isFormValid) {
      return;
    }
    setConfirmModalVisible(true);
  }, [isFormValid]);

  const handleConfirmTransfer = useCallback(async () => {
    setIsProcessing(true);
    const params: TransferPointParams = {
      toCode: account,
      toType: transferType === TransferType.PERSONAL ? 1 : 2,
      amount: Number(points),
    };
    try {
      const res = await transferPoint(params);
      if (res) {
        setSuccessModalVisible(true);
      }
    } catch (err: any) {
      Alert.alert('提示', err.message);
    } finally {
      setIsProcessing(false);
      setConfirmModalVisible(false);
    }
  }, [account, points, transferType]);

  const handleSuccessConfirm = useCallback(() => {
    setSuccessModalVisible(false);
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('pointsTransfer.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('pointsTransfer.availablePoints')}</Text>
          <Text style={styles.pointsValue}>{user?.availablePoints?.toLocaleString()}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('pointsTransfer.transferTo')}</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, transferType === TransferType.PERSONAL && styles.typeButtonActive]}
              onPress={() => handleTypeChange(TransferType.PERSONAL)}
            >
              <Text style={[styles.typeText, transferType === TransferType.PERSONAL && styles.typeTextActive]}>
                {t('pointsTransfer.personal')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, transferType === TransferType.COMPANY && styles.typeButtonActive]}
              onPress={() => handleTypeChange(TransferType.COMPANY)}
            >
              <Text style={[styles.typeText, transferType === TransferType.COMPANY && styles.typeTextActive]}>
                {t('pointsTransfer.company')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('pointsTransfer.account')}</Text>
            <TextInput
              style={styles.input}
              value={account}
              onChangeText={setAccount}
              placeholder={
                transferType === TransferType.PERSONAL
                  ? t('pointsTransfer.personalAccountPlaceholder')
                  : t('pointsTransfer.companyAccountPlaceholder')
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('pointsTransfer.points')}</Text>
            <TextInput
              style={styles.input}
              value={points}
              onChangeText={setPoints}
              placeholder={t('pointsTransfer.pointsPlaceholder')}
              keyboardType="numeric"
            />
            {invalidPointsReason ? <Text style={styles.errorText}>{invalidPointsReason}</Text> : null}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
          onPress={handleTransferPress}
          disabled={!isFormValid}
        >
          <Text style={styles.submitButtonText}>{t('pointsTransfer.transfer')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 确认转账弹窗 */}
      <ConfirmModal
        visible={confirmModalVisible}
        title={t('pointsTransfer.confirmTitle')}
        message={t('pointsTransfer.confirmMessage', { points })}
        cancelText={t('common.cancel')}
        confirmText={t('common.confirm')}
        onCancel={() => setConfirmModalVisible(false)}
        onConfirm={handleConfirmTransfer}
        isProcessing={isProcessing}
        style={{
          modalMessage: {
            color: '#FF0F3C',
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
});
