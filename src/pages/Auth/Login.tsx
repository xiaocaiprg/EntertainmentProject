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
import { useAuth } from '../../hooks/useAuth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';

interface LoginProps {
  navigation: any;
  onToggleMode?: () => void;
  route?: any;
}

export const Login: React.FC<LoginProps> = React.memo((props) => {
  const { navigation, route } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // 获取返回参数
  const returnScreen = route?.params?.returnScreen;
  const returnParams = route?.params?.params;

  const handleLogin = useCallback(async () => {
    if (!username || !password) {
      Alert.alert('提示', '请输入用户名和密码');
      return;
    }
    setLoading(true);
    const success = await login({ username, password });
    if (success) {
      if (returnScreen) {
        navigation.navigate(returnScreen, returnParams);
      } else {
        navigation.goBack();
      }
    } else {
      Alert.alert('登录失败', '用户名或密码错误');
    }
    setLoading(false);
  }, [username, password, login, navigation, returnScreen, returnParams]);

  const handleUsernameChange = useCallback((text: string) => {
    setUsername(text);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const handleNavigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="default" backgroundColor="#6c5ce7" />
      <KeyboardAvoidingView behavior={isIOS() ? 'padding' : 'height'} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <TouchableOpacity style={styles.backButton} onPress={handleNavigateBack}>
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>登录</Text>
              <Text style={styles.subtitle}>欢迎回来</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Icon name="person" size={20} color="#6c5ce7" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="用户名"
                  placeholderTextColor="#95a5a6"
                  value={username}
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

              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>登录</Text>}
              </TouchableOpacity>
              {/* <View style={styles.footer}>
                <Text style={styles.footerText}>没有账号？</Text>
                <TouchableOpacity onPress={props.onToggleMode}>
                  <Text style={styles.footerLink}>立即注册</Text>
                </TouchableOpacity>
              </View> */}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
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
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
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
