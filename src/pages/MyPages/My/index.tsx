import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Image, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../../hooks/useAuth';
import { useTranslation } from '../../../hooks/useTranslation';
import { STATUS_BAR_HEIGHT, isIOS } from '../../../utils/platform';
import { MemberBenefits } from './components/MemberBenefits';
import CustomText from '../../../components/CustomText';
import { PointsCard } from './components/PointsCard';
import { ActionArea } from './components/ActionArea';
import useFocusRefresh from '../../../hooks/useFocusRefresh';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { turnoverProcess, preRepay } from '../../../api/services/pointService';
import { useRole } from '../../../hooks/useRole';
import PayPasswordInput from '../../../bizComponents/PayPasswordInput';
import { PageSource } from '../../../interface/Points';

export const MyScreen = React.memo(({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const { user, isLoggedIn, logout, checkUserStatus } = useAuth();
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [isRepaying, setIsRepaying] = useState(false);
  const [payPassword, setPayPassword] = useState('');
  const { isOperationAdmin } = useRole();

  const handleLoginPress = useCallback(() => {
    navigation.navigate('Auth');
  }, [navigation]);

  const handleMyGames = useCallback(() => {
    navigation.navigate('MyGames');
  }, [navigation]);

  const handleFixedDeposits = useCallback(() => {
    navigation.navigate('FixedDeposits');
  }, [navigation]);

  const handleSettingsPress = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  const handleLogoutPress = useCallback(async () => {
    await logout();
  }, [logout]);

  const handleMyPoints = useCallback(
    (code?: string) => {
      navigation.navigate('MyPoints', code ? { code, source: PageSource.CREDIT } : {});
    },
    [navigation],
  );

  const handleOneClickSettlement = useCallback(() => {
    setShowSettlementModal(true);
  }, []);

  const handleSettlementConfirm = useCallback(async () => {
    setIsProcessing(true);
    try {
      await turnoverProcess();
      setShowSettlementModal(false);
      Alert.alert(t('my.settlementSuccess'));
    } catch (error) {
      Alert.alert(t('my.settlementFailed'));
    }
    setIsProcessing(false);
  }, [t]);

  const handleSettlementCancel = useCallback(() => {
    setShowSettlementModal(false);
  }, []);

  const handleRepayPress = useCallback(() => {
    if (user?.creditAccount?.repayAmount && user?.creditAccount?.repayAmount > 0) {
      setPayPassword('');
      setShowRepayModal(true);
    } else {
      Alert.alert('提示', t('my.noRepayAmount'));
    }
  }, [user?.creditAccount?.repayAmount, t]);

  const handleRepayConfirm = useCallback(async () => {
    if (payPassword.length !== 6) {
      return;
    }
    setIsRepaying(true);
    try {
      const res = await preRepay(payPassword);
      setShowRepayModal(false);
      Alert.alert('提示', res || t('my.repaySuccess'));
      checkUserStatus(); // 刷新用户状态
    } catch (error: any) {
      Alert.alert('提示', error.message || t('my.repayFailed'));
    }
    setIsRepaying(false);
  }, [payPassword, t, checkUserStatus]);

  const handleRepayCancel = useCallback(() => {
    setShowRepayModal(false);
    setPayPassword('');
  }, []);

  // 列表项组件
  const MenuItem = useCallback(
    ({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) => (
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuIconContainer}>
          <Icon name={icon} size={24} color="#6c5ce7" />
        </View>
        <CustomText style={styles.menuItemText}>{title}</CustomText>
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
        <CustomText style={styles.loginText}>{t('auth.loginToViewProfile')}</CustomText>
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <CustomText style={styles.loginButtonText}>{t('auth.login')}</CustomText>
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
            <CustomText style={styles.userName}>{user?.name || 'User'}</CustomText>
            <CustomText style={styles.userHandle}>{user?.code || 'code'}</CustomText>
          </View>
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
              <Icon name="settings" size={24} color="#fff" />
              <CustomText style={styles.settingsText}>{t('settings.settings')}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton} onPress={handleLogoutPress}>
              <Icon name="exit-to-app" size={24} color="#fff" />
              <CustomText style={styles.settingsText}>{t('my.loginout')}</CustomText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardContainer}>
          {user && <MemberBenefits user={user} navigation={navigation} />}
          {user && <PointsCard user={user} onPointsPress={(code?: string) => handleMyPoints(code)} />}
          <ActionArea navigation={navigation} onRepayPress={handleRepayPress} />
          {isOperationAdmin && (
            <View style={styles.settlementContainer}>
              <TouchableOpacity style={styles.settlementButton} onPress={handleOneClickSettlement}>
                <Icon name="account-balance" size={24} color="#fff" />
                <CustomText style={styles.settlementButtonText}>{t('my.oneClickSettlement')}</CustomText>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.menuContainer}>
            {/* <MenuItem icon="history" title={t('my.historyRecord')} onPress={handleHistoryPress} /> */}
            <MenuItem icon="playlist-play" title={t('my.myGames')} onPress={handleMyGames} />
            <MenuItem icon="account-balance-wallet" title={t('my.fixedDeposits')} onPress={handleFixedDeposits} />
          </View>
        </View>
      </>
    ),
    [
      user,
      handleMyGames,
      handleFixedDeposits,
      handleLogoutPress,
      MenuItem,
      t,
      navigation,
      handleSettingsPress,
      isOperationAdmin,
      handleMyPoints,
      handleOneClickSettlement,
      handleRepayPress,
    ],
  );

  useFocusRefresh(() => {
    checkUserStatus();
  });
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="default" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoggedIn ? renderLoggedIn() : renderNotLoggedIn()}
      </ScrollView>

      <ConfirmModal
        visible={showSettlementModal}
        title={t('my.settlementConfirmTitle')}
        message={t('my.settlementConfirmMessage')}
        onConfirm={handleSettlementConfirm}
        onCancel={handleSettlementCancel}
        isProcessing={isProcessing}
      />

      <ConfirmModal
        visible={showRepayModal}
        title={t('my.repayConfirmTitle')}
        message=""
        cancelText={t('common.cancel')}
        confirmText={t('common.confirm')}
        onCancel={handleRepayCancel}
        onConfirm={handleRepayConfirm}
        isProcessing={isRepaying}
        confirmButtonDisabled={payPassword.length !== 6}
        customContent={
          <View>
            <CustomText style={styles.repayMessage}>
              {t('my.repayConfirmMessage', { amount: user?.creditAccount?.repayAmount?.toLocaleString() || '0' })}
            </CustomText>
            <View style={styles.payPasswordContainer}>
              <CustomText style={styles.payPasswordLabel}>{t('my.payPassword')}</CustomText>
              <PayPasswordInput value={payPassword} onChangeText={setPayPassword} />
            </View>
          </View>
        }
        style={{
          modalMessage: {
            display: 'none',
          },
        }}
      />
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
    paddingTop: 10,
    paddingBottom: 30,
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
  cardContainer: {
    backgroundColor: '#f5f3fe',
  },
  settlementContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  settlementButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settlementButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 10,
    marginBottom: 10,
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
  repayMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  payPasswordContainer: {
    marginBottom: 10,
  },
  payPasswordLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
});
