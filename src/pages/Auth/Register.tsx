import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';

interface RegisterProps {
  navigation: any;
  onToggleMode: () => void;
}

export const Register: React.FC<RegisterProps> = React.memo(({ navigation, onToggleMode }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = useCallback(async () => {
    if (!name || !password || !confirmPassword) {
      Alert.alert('提示', '请填写所有字段');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('提示', '两次输入的密码不一致');
      return;
    }

    setLoading(true);
    // try {
    //   const success = await register(name, password);
    //   if (!success) {
    //     Alert.alert('注册失败', '用户名可能已被占用');
    //   }
    // } catch (error) {
    //   Alert.alert('错误', '注册过程中发生错误');
    //   console.log(error);
    // } finally {
    //   setLoading(false);
    // }
  }, [name, password, confirmPassword]);

  const handleUsernameChange = useCallback((text: string) => {
    setName(text);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const handleConfirmPasswordChange = useCallback((text: string) => {
    setConfirmPassword(text);
  }, []);

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="default" />
      <KeyboardAvoidingView behavior={isIOS() ? 'padding' : 'height'} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <TouchableOpacity style={styles.backButton} onPress={handleNavigateBack}>
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>注册</Text>
              <Text style={styles.subtitle}>创建一个新账号</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Icon name="person" size={20} color="#6c5ce7" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="用户名"
                  placeholderTextColor="#95a5a6"
                  value={name}
                  onChangeText={handleUsernameChange}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#6c5ce7" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="密码"
                  placeholderTextColor="#95a5a6"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#6c5ce7" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="确认密码"
                  placeholderTextColor="#95a5a6"
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>注册</Text>}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>已有账号？</Text>
                <TouchableOpacity onPress={onToggleMode}>
                  <Text style={styles.footerLink}>立即登录</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#6c5ce7',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6c5ce7',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  footerLink: {
    color: '#6c5ce7',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
});
