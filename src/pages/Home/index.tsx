import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { STATUS_BAR_HEIGHT, SCREEN_WIDTH } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';
import { useAuth } from '../../hooks/useAuth';

const BANNER_HEIGHT = 300; // 增加banner高度
const HEADER_HEIGHT = 60;

export const HomeScreen = React.memo(() => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current; // 用于监听滚动位置
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isLoggedIn } = useAuth();

  // 计算背景色透明度
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, BANNER_HEIGHT - HEADER_HEIGHT - STATUS_BAR_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // 轮播图数据
  const banners = useMemo(
    () => [
      // {
      //   id: 1,
      //   image: 'https://fastly.picsum.photos/id/866/400/300.jpg?hmac=JMubLT0llOloTrCSJIptm4kmT13cmWrNcdbpI9vJwmw',
      // },
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

  // 轮播Banner渲染
  const bannerContent = useMemo(
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

  // 检查登录态并跳转
  const handleChallengePress = useCallback(
    (type: 'new' | 'existing') => {
      if (isLoggedIn) {
        // 已登录，直接跳转
        navigation.navigate('ChallengeSelect', { type });
      } else {
        // 未登录，跳转到登录页面，并设置返回参数
        navigation.navigate('Auth', {
          returnScreen: 'ChallengeSelect',
          params: { type },
        });
      }
    },
    [navigation, isLoggedIn],
  );

  // 挑战选择模块
  const challengeSection = useCallback(
    () => (
      <View style={styles.challengeContainer}>
        <Text style={styles.challengeTitle}>选择挑战</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => handleChallengePress('new')}>
            <View style={styles.challengeButton}>
              <Icon name="add-circle" size={24} color="#111" />
              <Text style={styles.challengeButtonText}>新增挑战</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleChallengePress('existing')}>
            <View style={styles.challengeButton}>
              <Icon name="history" size={24} color="#111" />
              <Text style={styles.challengeButtonText}>已有挑战</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleChallengePress],
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="default" />

      {/* 固定在顶部的Header，随着滚动变得可见 */}
      <Animated.View style={[styles.header, { opacity: 1 }]}>
        <Animated.View style={[styles.headerBackground, { opacity: headerBgOpacity }]} />
        <Text style={styles.headerTitle}>俊龍娛樂</Text>
      </Animated.View>

      <Animated.ScrollView
        style={styles.content}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Banner作为背景 */}
        {bannerContent}

        <View style={styles.contentContainer}>{challengeSection()}</View>
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
    paddingBottom: 15,
    paddingHorizontal: 20,
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
    zIndex: 1,
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
  challengeContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
  },
  challengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: 300,
    height: 60,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  challengeButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
