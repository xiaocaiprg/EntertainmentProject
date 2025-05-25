import React, { useState, useCallback } from 'react';
import {
  View,
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
import CustomText from '../../components/CustomText';
import CustomTextInput from '../../components/CustomTextInput';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';

interface LoginProps {
  navigation: any;
  onToggleMode?: () => void;
  route?: any;
}

export const Login: React.FC<LoginProps> = React.memo((props) => {
  const { navigation, route } = props;
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isDownloading } = useAuth();

  // 获取返回参数
  const returnScreen = route?.params?.returnScreen;
  const returnParams = route?.params?.params;

  const handleLogin = useCallback(async () => {
    // 检查是否正在下载更新
    if (isDownloading) {
      Alert.alert('无法登录', '正在下载应用更新，请等待下载完成后再登录');
      return;
    }

    if (!code || !password) {
      Alert.alert('提示', '请输入用户名和密码');
      return;
    }
    setLoading(true);
    const success = await login({ code, password });
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
  }, [code, password, login, navigation, returnScreen, returnParams, isDownloading]);

  const handleUsernameChange = useCallback((text: string) => {
    setCode(text);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
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
              <CustomText style={styles.title}>登录</CustomText>
              <CustomText style={styles.subtitle}>欢迎回来</CustomText>
            </View>

            <View style={styles.form}>
              {isDownloading && (
                <View style={styles.updateWarning}>
                  <Icon name="system-update" size={20} color="#e74c3c" />
                  <CustomText style={styles.updateWarningText}>应用正在更新中，暂时无法登录</CustomText>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Icon name="person" size={20} color="#6c5ce7" style={styles.inputIcon} />
                <CustomTextInput
                  style={styles.input}
                  placeholder="用户编号"
                  placeholderTextColor="#95a5a6"
                  value={code}
                  onChangeText={handleUsernameChange}
                  autoCapitalize="none"
                  editable={!isDownloading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#6c5ce7" style={styles.inputIcon} />
                <CustomTextInput
                  style={styles.input}
                  placeholder="密码"
                  placeholderTextColor="#95a5a6"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry
                  editable={!isDownloading}
                />
              </View>

              <TouchableOpacity
                style={[styles.button, isDownloading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={loading || isDownloading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <CustomText style={styles.buttonText}>{isDownloading ? '更新中，请稍候' : '登录'}</CustomText>
                )}
              </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  updateWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffecec',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  updateWarningText: {
    color: '#e74c3c',
    marginLeft: 10,
    fontSize: 14,
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
    borderWidth: 1,
    borderColor: '#5b4ddb',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    borderColor: '#a9aeb2',
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
