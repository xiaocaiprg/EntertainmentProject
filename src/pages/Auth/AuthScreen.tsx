import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Login } from './Login';
import { Register } from './Register';

interface AuthScreenProps {
  navigation: any;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin);
  }, [isLogin]);

  return (
    <View style={styles.container}>
      {isLogin ? (
        <Login navigation={navigation} onToggleMode={toggleMode} />
      ) : (
        <Register navigation={navigation} onToggleMode={toggleMode} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6c5ce7',
  },
});
