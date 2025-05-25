import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import SlideModal from '../../../components/SlideModal';
import { createRacePool } from '../../../api/services/raceService';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomTextInput from '../../../components/CustomTextInput';
import CustomText from '../../../components/CustomText';

interface CreateRacePoolModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateRacePoolModal = React.memo((props: CreateRacePoolModalProps) => {
  const { onClose, onSuccess } = props;
  const { t } = useTranslation();
  const [poolName, setPoolName] = useState<string>('');
  const [poolDescription, setPoolDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 处理创建奖金池
  const handleCreatePool = useCallback(async () => {
    if (!poolName.trim()) {
      Alert.alert(t('racePoolList.enterPoolName'));
      return;
    }
    setIsSubmitting(true);
    try {
      await createRacePool({ name: poolName, description: poolDescription });
      Alert.alert(t('racePoolList.createSuccess'));
      onClose();
      onSuccess();
    } catch (error: any) {
      const errorMessage = error?.message || t('racePoolList.createFailed');
      Alert.alert(errorMessage);
    }
    setIsSubmitting(false);
  }, [poolName, poolDescription, t, onClose, onSuccess]);

  // 关闭弹窗时清空输入
  const handleClose = useCallback(() => {
    setPoolName('');
    setPoolDescription('');
    onClose();
  }, [onClose]);

  return (
    <SlideModal visible={true} onClose={handleClose} title={t('racePoolList.createPoolTitle')}>
      <View style={styles.modalContent}>
        <CustomTextInput
          style={styles.input}
          placeholder={t('racePoolList.poolNamePlaceholder')}
          value={poolName}
          onChangeText={setPoolName}
          placeholderTextColor={THEME_COLORS.text.light}
        />
        <CustomTextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder={t('racePoolList.poolDescriptionPlaceholder')}
          value={poolDescription}
          onChangeText={setPoolDescription}
          multiline
          numberOfLines={4}
          placeholderTextColor={THEME_COLORS.text.light}
        />
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleCreatePool}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <CustomText style={styles.submitButtonText}>{t('racePoolList.submit')}</CustomText>
          )}
        </TouchableOpacity>
      </View>
    </SlideModal>
  );
});

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    color: THEME_COLORS.text.primary,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: THEME_COLORS.disabled,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
