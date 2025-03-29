import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { STATUS_BAR_HEIGHT, SCREEN_WIDTH } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';
import { useAuth } from '../../hooks/useAuth';
import { mapUserRole, getUserAccessibleModules } from './utils/homeLogic';
import { ModuleType } from './interface/IModuleProps';

const BANNER_HEIGHT = 230;
const HEADER_HEIGHT = 60;

export const HomeScreen = React.memo(() => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current; // 用于监听滚动位置
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isLoggedIn, user } = useAuth();
  // 从用户信息中获取角色
  const userRole = useMemo(() => mapUserRole(user?.role), [user?.role]);
  // 获取当前用户可访问的模块
  const accessibleModules = useMemo(() => getUserAccessibleModules(userRole), [userRole]);

  // 计算背景色透明度
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, BANNER_HEIGHT - HEADER_HEIGHT - STATUS_BAR_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  // 轮播图数据
  const banners = useMemo(
    () => [
      {
        id: 1,
        image: 'http://85.31.225.25/image/head.png',
      },
    ],
    [],
  );
  // 自动轮播效果
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);
  const bannerContent = useCallback(
    () => (
      <View style={styles.bannerContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: currentBanner * SCREEN_WIDTH, y: 0 }}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.floor(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentBanner(newIndex);
          }}
        >
          {banners.map((banner) => (
            <Image key={banner.id} source={{ uri: banner.image }} style={styles.bannerImage} resizeMode="cover" />
          ))}
        </ScrollView>
        <View style={styles.paginationContainer}>
          {Boolean(banners.length > 1) &&
            banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  { backgroundColor: index === currentBanner ? '#6c5ce7' : 'rgba(255, 255, 255, 0.5)' },
                ]}
              />
            ))}
        </View>
      </View>
    ),
    [banners, currentBanner],
  );
  // 检查登录态和权限并跳转
  const handleModulePress = useCallback(
    (moduleType: ModuleType) => {
      switch (moduleType) {
        case ModuleType.CHALLENGE_NEW:
          navigation.navigate('NewChallenge');
          break;
        case ModuleType.CHALLENGE_EXISTING:
          navigation.navigate('ExistingChallenge');
          break;
        case ModuleType.ALL_CHALLENGE:
          navigation.navigate('AllChallenge');
          break;
        default:
          break;
      }
    },
    [navigation],
  );
  // 根据模块配置渲染模块
  const renderModules = useCallback(() => {
    return (
      <View style={styles.modulesContainer}>
        <View style={styles.moduleGrid}>
          {accessibleModules.map((module) => (
            <TouchableOpacity
              key={module.id}
              onPress={() => handleModulePress(module.type)}
              style={styles.moduleWrapper}
            >
              <View style={[styles.moduleButton, { backgroundColor: module.backgroundColor }]}>
                <Icon name={module.icon} size={24} color="#fff" />
                <Text style={styles.moduleButtonText}>{module.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }, [accessibleModules, handleModulePress]);
  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate('Auth', {
        returnScreen: 'Home',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="default" />
      <Animated.View style={[styles.header, { opacity: 1 }]}>
        <Animated.View style={[styles.headerBackground, { opacity: headerBgOpacity }]} />
        <Text style={styles.headerTitle}>俊龍娛樂</Text>
      </Animated.View>

      <Animated.ScrollView
        style={styles.content}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {bannerContent()}
        <View style={styles.contentContainer}>{renderModules()}</View>
      </Animated.ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: STATUS_BAR_HEIGHT + 15,
    paddingHorizontal: 20,
    paddingBottom: 5,
    height: HEADER_HEIGHT + STATUS_BAR_HEIGHT,
    zIndex: 100,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: THEME_COLORS.primary,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f3fe',
  },
  contentContainer: {
    backgroundColor: '#f5f3fe',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 5,
  },
  bannerContainer: {
    height: BANNER_HEIGHT,
    position: 'relative',
  },
  bannerImage: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  modulesContainer: {
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 5,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleWrapper: {
    flex: 1,
    marginBottom: 15,
    marginRight: 10,
  },
  moduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  moduleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
