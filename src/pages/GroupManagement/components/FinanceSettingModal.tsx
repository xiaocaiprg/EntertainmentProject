import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { switchFinance } from '../../../api/services/financeService';
import { InterestStatus, AccountType, InterestSwitchType } from '../../../interface/Finance';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomText from '../../../components/CustomText';
import SlideModal from '../../../components/SlideModal';
import RadioGroup from '../../../components/RadioGroup';
import NumberInput from '../../../components/NumberInput';
import { THEME_COLORS } from '../../../utils/styles';

interface FinanceSettingData {
  groupCode: string;
  settingType: InterestSwitchType;
  isEnabled: InterestStatus;
  interestRate: string;
}

interface FinanceSettingModalProps {
  visible: boolean;
  settingData: FinanceSettingData;
  onClose: () => void;
  onSuccess: () => void;
  onSettingChange: (key: keyof FinanceSettingData, value: any) => void;
}

export const FinanceSettingModal: React.FC<FinanceSettingModalProps> = React.memo((props) => {
  const { visible, settingData, onClose, onSuccess, onSettingChange } = props;
  const { t } = useTranslation();

  // 开关选项
  const switchOptions = useMemo(
    () => [
      { label: t('group.disabled'), value: InterestStatus.DISABLED },
      { label: t('group.enabled'), value: InterestStatus.ENABLED },
    ],
    [t],
  );

  // 年化利率输入处理
  const handleInterestRateChange = useCallback(
    (text: string) => {
      // 限制小数点后一位
      const regex = /^\d*\.?\d{0,1}$/;
      if (regex.test(text)) {
        onSettingChange('interestRate', text);
      }
    },
    [onSettingChange],
  );

  // 验证表单
  const isFormValid = useMemo(() => {
    if (settingData.isEnabled === InterestStatus.ENABLED) {
      return settingData.interestRate.trim() !== '' && parseFloat(settingData.interestRate) > 0;
    }
    return true;
  }, [settingData]);

  // 提交确认处理
  const handleConfirmSubmit = useCallback(async () => {
    try {
      const shouldIncludeInterestRate =
        settingData.isEnabled === InterestStatus.ENABLED && settingData.interestRate.trim() !== '';

      const params = {
        code: settingData.groupCode,
        userType: AccountType.GROUP,
        interestSwitchType: settingData.settingType,
        isEnabled: settingData.isEnabled,
        ...(shouldIncludeInterestRate && {
          interestRate: parseFloat(settingData.interestRate),
        }),
      };
      await switchFinance(params);
      onClose();
      Alert.alert(t('common.success'), t('group.settingSuccess'));
      onSuccess();
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    }
  }, [settingData, onClose, onSuccess, t]);

  // 提交设置
  const handleSubmitSetting = useCallback(() => {
    if (!isFormValid) {
      return;
    }
    Alert.alert(t('group.settingTitle'), t('group.confirmMessage'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('common.confirm'),
        onPress: handleConfirmSubmit,
      },
    ]);
  }, [isFormValid, t, handleConfirmSubmit]);

  const modalTitle =
    settingData.settingType === InterestSwitchType.CURRENT ? t('group.currentSettings') : t('group.fixedSettings');

  return (
    <>
      <SlideModal visible={visible} onClose={onClose} title={modalTitle}>
        <View style={styles.modalContent}>
          <View style={styles.settingSection}>
            <CustomText style={styles.sectionTitle}>{t('group.interestSwitch')}</CustomText>
            <RadioGroup
              options={switchOptions}
              selectedValue={settingData.isEnabled}
              onSelect={(value) => onSettingChange('isEnabled', value)}
              style={styles.radioGroup}
            />
          </View>
          {settingData.isEnabled === InterestStatus.ENABLED && (
            <View style={styles.settingSection}>
              <CustomText style={styles.sectionTitle}>{t('group.interestRate')}</CustomText>
              <View style={styles.inputWrapper}>
                <NumberInput
                  value={settingData.interestRate}
                  onChangeText={handleInterestRateChange}
                  placeholder={t('group.interestRatePlaceholder')}
                  keyboardType="decimal-pad"
                  hint="支持小数点后一位"
                />
                <CustomText style={styles.percentSymbol}>%</CustomText>
              </View>
            </View>
          )}
          <TouchableOpacity
            style={[styles.confirmButton, !isFormValid && styles.confirmButtonDisabled]}
            onPress={handleSubmitSetting}
            disabled={!isFormValid}
            activeOpacity={0.7}
          >
            <CustomText style={styles.confirmButtonText}>{t('group.confirmSetting')}</CustomText>
          </TouchableOpacity>
        </View>
      </SlideModal>
    </>
  );
});

const styles = StyleSheet.create({
  modalContent: {
    padding: 15,
  },
  settingSection: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentSymbol: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  radioGroup: {
    marginTop: 5,
  },
  confirmButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FinanceSettingModal;
