import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';

export const MyScreen = React.memo(({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const { user, isLoggedIn, logout } = useAuth();

  const handleLoginPress = useCallback(() => {
    navigation.navigate('Auth');
  }, [navigation]);

  // const handleHistoryPress = useCallback(() => {
  //   navigation.navigate('GameHistory');
  // }, [navigation]);

  const handleMyGames = useCallback(() => {
    navigation.navigate('MyGames');
  }, [navigation]);

  const handleSettingsPress = useCallback(() => {
    navigation.navigate('Settings');
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
        <Text style={styles.loginText}>{t('auth.loginToViewProfile')}</Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.loginButtonText}>{t('auth.login')}</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleLoginPress, t],
  );

  // 已登录状态的UI
  const renderLoggedIn = useCallback(
    () => (
      <>
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://junlongpro.s3.ap-southeast-1.amazonaws.com/user.jpg',
              }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userHandle}>@{user?.name || 'User'}</Text>
          </View>
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
              <Icon name="settings" size={24} color="#fff" />
              <Text style={styles.settingsText}>{t('settings.settings')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton} onPress={handleLogoutPress}>
              <Icon name="exit-to-app" size={24} color="#fff" />
              <Text style={styles.settingsText}>{t('my.loginout')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/*
        <View style={styles.membershipCardWrapper}>
          <View style={styles.membershipCard}>
            <Text style={styles.membershipLabel}>{t('my.membershipBenefits')}</Text>
          </View>
        </View> */}

        <View style={styles.menuContainer}>
          {/* <MenuItem icon="history" title={t('my.historyRecord')} onPress={handleHistoryPress} /> */}
          <MenuItem icon="playlist-play" title={t('my.myGames')} onPress={handleMyGames} />
        </View>
      </>
    ),
    [user, handleMyGames, handleLogoutPress, MenuItem, t, handleSettingsPress],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="default" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoggedIn ? renderLoggedIn() : renderNotLoggedIn()}
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#6c5ce7',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  settingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  settingsText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f3fe',
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
    paddingTop: 20,
    paddingBottom: 10,
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
  // 列表模块样式
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
