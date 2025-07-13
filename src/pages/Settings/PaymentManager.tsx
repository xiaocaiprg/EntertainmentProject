import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../hooks/useTranslation';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { RootStackScreenProps } from '../router';
import { changePayPassword } from '../../api/services/authService';
import CustomText from '../../components/CustomText';

// 使用导航堆栈中定义的类型
type PaymentManagerScreenProps = RootStackScreenProps<'PaymentManager'>;

export const PaymentManager: React.FC<PaymentManagerScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 校验6位数字密码
  const isValidPassword = useCallback((password: string) => {
    return /^\d{6}$/.test(password);
  }, []);

  const isFormValid = useCallback(() => {
    if (!oldPassword.length) {
      setErrorMsg(t('paymentManager.oldPasswordEmpty'));
      return false;
    }
    if (!isValidPassword(oldPassword)) {
      setErrorMsg(t('paymentManager.oldPasswordInvalid'));
      return false;
    }
    if (!newPassword.length) {
      setErrorMsg(t('paymentManager.newPasswordEmpty'));
      return false;
    }
    if (!isValidPassword(newPassword)) {
      setErrorMsg(t('paymentManager.passwordInvalid'));
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(t('paymentManager.passwordNotMatch'));
      return false;
    }
    return true;
  }, [oldPassword, newPassword, confirmPassword, isValidPassword, t]);

  const handleSubmit = useCallback(async () => {
    if (!isFormValid()) {
      return;
    }
    setErrorMsg('');
    try {
      await changePayPassword({
        oldPayPassword: oldPassword,
        newPayPassword: newPassword,
      });
      Alert.alert(t('paymentManager.success'));
      navigation.goBack();
    } catch (error: any) {
      setErrorMsg(error?.message || t('paymentManager.failed'));
    }
  }, [isFormValid, oldPassword, newPassword, navigation, t]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('paymentManager.title')}</CustomText>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <CustomText style={styles.label}>{t('paymentManager.oldPassword')}</CustomText>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholderTextColor="#999"
            placeholder={t('paymentManager.enterOldPassword')}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <CustomText style={styles.label}>{t('paymentManager.newPassword')}</CustomText>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor="#999"
            placeholder={t('paymentManager.enterNewPassword')}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <CustomText style={styles.label}>{t('paymentManager.confirmPassword')}</CustomText>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('paymentManager.confirmNewPassword')}
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {errorMsg ? <CustomText style={styles.errorText}>{errorMsg}</CustomText> : null}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <CustomText style={styles.submitButtonText}>{t('paymentManager.submit')}</CustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  header: {
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#6c5ce7',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
