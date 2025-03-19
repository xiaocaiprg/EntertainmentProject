import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';

export const MyScreen = React.memo(({ navigation }: { navigation: any }) => {
  const { user, isLoggedIn } = useAuth();

  const handleLoginPress = useCallback(() => {
    navigation.navigate('Auth');
  }, [navigation]);

  // 未登录状态的UI
  const renderNotLoggedIn = useCallback(
    () => (
      <View style={styles.notLoggedInContainer}>
        <FontAwesome name="user-circle" size={100} color="#bdc3c7" />
        <Text style={styles.loginText}>请登录以查看个人信息</Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.loginButtonText}>登录 / 注册</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleLoginPress],
  );

  // 快捷功能项
  const quickActions = useMemo(
    () => [
      { icon: 'send', title: '转账' },
      { icon: 'payment', title: '支付' },
      { icon: 'trending-up', title: '充值' },
      { icon: 'call-received', title: '收款' },
    ],
    [],
  );

  // 渲染快捷功能项
  const quickActionsRendered = useMemo(
    () =>
      quickActions.map((item, index) => (
        <TouchableOpacity key={index} style={styles.quickActionItem}>
          <View style={styles.quickActionIconContainer}>
            <Icon name={item.icon} size={24} color="#6c5ce7" />
          </View>
          <Text style={styles.quickActionText}>{item.title}</Text>
        </TouchableOpacity>
      )),
    [quickActions],
  );

  // 菜单项数据
  const menuItems = useMemo(
    () => [
      { icon: 'shopping-bag', title: '电子购物' },
      { icon: 'file-text', title: '账单支付' },
      { icon: 'heart', title: '慈善' },
      { icon: 'gift', title: '发送礼物' },
      { icon: 'users', title: '账单分摊' },
      { icon: 'money', title: '返现' },
    ],
    [],
  );

  // 菜单项渲染 - 每行两个
  const menuItemsRendered = useMemo(() => {
    const rows = [];
    for (let i = 0; i < menuItems.length; i += 2) {
      rows.push(
        <View key={i} style={styles.menuRow}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <FontAwesome name={menuItems[i].icon} size={20} color="#6c5ce7" />
            </View>
            <Text style={styles.menuTitle}>{menuItems[i].title}</Text>
          </TouchableOpacity>
          {i + 1 < menuItems.length && (
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <FontAwesome name={menuItems[i + 1].icon} size={20} color="#6c5ce7" />
              </View>
              <Text style={styles.menuTitle}>{menuItems[i + 1].title}</Text>
            </TouchableOpacity>
          )}
        </View>,
      );
    }
    return rows;
  }, [menuItems]);

  // 已登录状态的UI
  const renderLoggedIn = useCallback(
    () => (
      <>
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.avatar} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.username || 'Ika Puspita Sari'}</Text>
            <Text style={styles.userHandle}>@ikapuspitasari8</Text>
          </View>
        </View>

        <View style={styles.membershipCardWrapper}>
          <View style={styles.membershipCard}>
            <View style={styles.membershipHeader}>
              <Text style={styles.membershipLabel}>会员权益</Text>
              <View style={styles.membershipBadge}>
                <Text style={styles.membershipLevel}>黄金会员</Text>
              </View>
            </View>
            <View style={styles.quickActionsContainer}>{quickActionsRendered}</View>
          </View>
        </View>

        <View style={styles.menuContainer}>{menuItemsRendered}</View>

        <View style={styles.promoSection}>
          <View style={styles.promoHeader}>
            <Text style={styles.promoTitle}>优惠活动</Text>
            <Icon name="chevron-right" size={24} color="#666" />
          </View>

          <View style={styles.savingAccountCard}>
            <View style={styles.savingIconContainer}>
              <Icon name="account-balance-wallet" size={24} color="#fff" />
            </View>
            <View style={styles.savingInfo}>
              <Text style={styles.savingTitle}>储蓄账户</Text>
              <Text style={styles.savingDesc}>每月最高可获得10%利息！</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomTabBar}>
          <TouchableOpacity style={styles.bottomTabItem}>
            <Icon name="account-balance-wallet" size={24} color="#6c5ce7" />
            <Text style={[styles.bottomTabText, styles.bottomTabActive]}>我的钱包</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomTabItem}>
            <Icon name="insights" size={24} color="#999" />
            <Text style={styles.bottomTabText}>洞察</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bottomTabItem}>
            <Icon name="settings" size={24} color="#999" />
            <Text style={styles.bottomTabText}>工具</Text>
          </TouchableOpacity>
        </View>
      </>
    ),
    [user, quickActionsRendered, menuItemsRendered],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="default" backgroundColor="#6c5ce7" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="notifications" size={24} color="#fff" />
          </TouchableOpacity>
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
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f3fe',
  },
  header: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 15,
    paddingHorizontal: 20,
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
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 50,
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
  membershipCardWrapper: {
    marginTop: -40,
    marginHorizontal: 15,
    zIndex: 1,
  },
  membershipCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  membershipLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  membershipBadge: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  membershipLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickActionItem: {
    alignItems: 'center',
    width: '23%',
  },
  quickActionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
  },
  menuContainer: {
    padding: 15,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  menuTitle: {
    fontSize: 14,
    color: '#333',
  },
  promoSection: {
    padding: 15,
  },
  promoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  savingAccountCard: {
    backgroundColor: '#6c5ce7',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  savingInfo: {
    flex: 1,
  },
  savingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  savingDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 20,
  },
  bottomTabItem: {
    alignItems: 'center',
  },
  bottomTabText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  bottomTabActive: {
    color: '#6c5ce7',
    fontWeight: 'bold',
  },
});
