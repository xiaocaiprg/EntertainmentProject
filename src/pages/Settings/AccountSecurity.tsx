import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../hooks/useTranslation';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { RootStackScreenProps } from '../router';
import { changePassword } from '../../api/services/authService';
import { useAuth } from '../../hooks/useAuth';

// 使用导航堆栈中定义的类型
type AccountSecurityScreenProps = RootStackScreenProps<'AccountSecurity'>;

export const AccountSecurity: React.FC<AccountSecurityScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const isFormValid = useCallback(() => {
    if (newPassword !== confirmPassword) {
      setErrorMsg(t('accountSecurity.passwordNotMatch'));
      return;
    }
    if (!newPassword.length || !confirmPassword.length) {
      setErrorMsg(t('accountSecurity.passwordEmpty'));
      return;
    }
    return newPassword === confirmPassword;
  }, [newPassword, confirmPassword, t]);

  const handleSubmit = useCallback(async () => {
    if (!isFormValid()) {
      return;
    }
    setErrorMsg('');
    try {
      await changePassword(newPassword);
      Alert.alert(t('accountSecurity.success'));
      navigation.goBack();
      logout();
    } catch (error: any) {
      setErrorMsg(error?.message || t('accountSecurity.failed'));
    }
  }, [isFormValid, newPassword, navigation, t, logout]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Icon name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('accountSecurity.title')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('accountSecurity.newPassword')}</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder={t('accountSecurity.enterNewPassword')}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('accountSecurity.confirmPassword')}</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('accountSecurity.confirmNewPassword')}
            />
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>{t('accountSecurity.submit')}</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
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
