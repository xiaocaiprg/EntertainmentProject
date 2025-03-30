import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../hooks/useAuth';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';

export const MyScreen = React.memo(({ navigation }: { navigation: any }) => {
  const { user, isLoggedIn, logout } = useAuth();

  const handleLoginPress = useCallback(() => {
    navigation.navigate('Auth');
  }, [navigation]);

  const handleHistoryPress = useCallback(() => {
    navigation.navigate('GameHistory');
  }, [navigation]);

  const handleLogoutPress = useCallback(async () => {
    await logout();
  }, [logout]);

  // 列表项组件
  const MenuItem = useCallback(
    ({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) => (
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuIconContainer}>
          <Icon name={icon} size={24} color="#6c5ce7" />
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
        <Icon name="chevron-right" size={24} color="#bdc3c7" />
      </TouchableOpacity>
    ),
    [],
  );

  // 未登录状态的UI
  const renderNotLoggedIn = useCallback(
    () => (
      <View style={styles.notLoggedInContainer}>
        <FontAwesome name="user-circle" size={100} color="#bdc3c7" />
        <Text style={styles.loginText}>请登录以查看个人信息</Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.loginButtonText}>登录</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleLoginPress],
  );

  // 已登录状态的UI
  const renderLoggedIn = useCallback(
    () => (
      <>
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'http://85.31.225.25/image/avatar.png',
              }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Ika Puspita Sari'}</Text>
            <Text style={styles.userHandle}>@{user?.name || 'ikapuspitasari8'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
            <Icon name="exit-to-app" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {/*
        <View style={styles.membershipCardWrapper}>
          <View style={styles.membershipCard}>
            <Text style={styles.membershipLabel}>会员权益</Text>
          </View>
        </View> */}

        <View style={styles.menuContainer}>
          <MenuItem icon="history" title="历史记录" onPress={handleHistoryPress} />
        </View>
      </>
    ),
    [user, handleHistoryPress, handleLogoutPress, MenuItem],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="default" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <Icon name="notifications" size={24} color="#fff" />
          </TouchableOpacity> */}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {isLoggedIn ? renderLoggedIn() : renderNotLoggedIn()}
        </ScrollView>
      </View>
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
    backgroundColor: '#f5f3fe',
  },
  header: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  // 未登录状态的样式
  notLoggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 100,
  },
  loginText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 20,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // 已登录状态的样式
  userInfoContainer: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userHandle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // membershipCardWrapper: {
  //   marginTop: -40,
  //   marginHorizontal: 15,
  //   zIndex: 1,
  // },
  // membershipCard: {
  //   backgroundColor: '#fff',
  //   borderRadius: 15,
  //   padding: 20,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 5,
  // },

  // membershipLabel: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   color: '#333',
  // },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  // 列表模块样式
  menuContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f3fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
