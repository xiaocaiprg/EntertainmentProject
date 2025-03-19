import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { STATUS_BAR_HEIGHT, SCREEN_WIDTH } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';

const BANNER_HEIGHT = 300; // 增加banner高度
const HEADER_HEIGHT = 60;

export const HomeScreen = React.memo(() => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current; // 用于监听滚动位置
  const navigation = useNavigation<StackNavigationProp<any>>();

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
        image: 'https://fastly.picsum.photos/id/866/400/300.jpg?hmac=JMubLT0llOloTrCSJIptm4kmT13cmWrNcdbpI9vJwmw',
      },
      {
        id: 2,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1S-CBJvZ_gXUEZCsWL0arWx0now6CcFs8Yg&s',
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

  const recommendedItems = useMemo(() => {
    return [1, 2, 3, 4].map((item) => (
      <TouchableOpacity key={item} style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="article" size={20} color="#6c5ce7" />
          <Text style={styles.cardTitle}>内容 {item}</Text>
        </View>
        <Text style={styles.cardDesc}>这是一段内容描述</Text>
      </TouchableOpacity>
    ));
  }, []);

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
          {banners.map((_, index) => (
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

  // 一键开局模块
  const quickStartSection = useCallback(
    () => (
      <View style={styles.quickStartContainer}>
        <Text style={styles.quickStartTitle}>快速开始</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Game')}>
          <View style={styles.quickStartButton}>
            <Icon name="play-arrow" size={24} color="#fff" />
            <Text style={styles.quickStartButtonText}>一键开局</Text>
          </View>
        </TouchableOpacity>
      </View>
    ),
    [navigation],
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

        <View style={styles.contentContainer}>
          {quickStartSection()}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>推荐内容</Text>
            <View style={styles.cardContainer}>{recommendedItems}</View>
          </View>
        </View>
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
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    zIndex: 1,
  },
  content: {
    flex: 1,
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
  quickStartContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    height: 150,
    elevation: 5,
  },
  quickStartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  quickStartButton: {
    backgroundColor: '#6c5ce7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    width: 300,
    height: 60,
  },
  quickStartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
