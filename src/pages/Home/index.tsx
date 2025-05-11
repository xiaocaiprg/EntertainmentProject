import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { STATUS_BAR_HEIGHT, SCREEN_WIDTH } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import { getUserAccessibleModules } from '../../utils/moduleLogic';
import { ModuleType } from '../../interface/Role';
import { useTranslation } from '../../hooks/useTranslation';

const BANNER_HEIGHT = 180;
const HEADER_HEIGHT = 35;
const CARD_WIDTH = SCREEN_WIDTH - 40;

export const HomeScreen = React.memo(() => {
  const { t } = useTranslation();
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerScrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isLoggedIn, initCheckLogin } = useAuth();
  const { userRole } = useRole();

  // 获取当前用户可访问的模块
  const accessibleModules = useMemo(() => getUserAccessibleModules(userRole), [userRole]);

  // 轮播图数据
  const banners = useMemo(
    () => [
      {
        id: 1,
        image: 'https://junlongpro.s3.ap-southeast-1.amazonaws.com/chess.jpg',
      },
      {
        id: 2,
        image: 'https://junlongpro.s3.ap-southeast-1.amazonaws.com/puzzle.jpg',
      },
      {
        id: 3,
        image: 'https://junlongpro.s3.ap-southeast-1.amazonaws.com/macao.jpg',
      },
    ],
    [],
  );

  // 自动轮播效果
  useEffect(() => {
    const interval = setInterval(() => {
      if (banners.length > 1) {
        const nextBanner = (currentBanner + 1) % banners.length;
        setCurrentBanner(nextBanner);
        bannerScrollViewRef.current?.scrollTo({
          x: nextBanner * SCREEN_WIDTH,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length, currentBanner]);

  // 处理手动滚动结束事件
  const handleScrollEnd = useCallback((event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentBanner(newIndex);
  }, []);

  const bannerContent = useCallback(
    () => (
      <View style={styles.bannerContainer}>
        <ScrollView
          ref={bannerScrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          decelerationRate="fast"
        >
          {banners.map((banner, index) => (
            <View key={index} style={styles.bannerCardContainer}>
              <View style={styles.bannerCard}>
                <Image source={{ uri: banner.image }} style={styles.bannerImage} resizeMode="cover" />
              </View>
            </View>
          ))}
        </ScrollView>
        {banners.length > 1 && (
          <View style={styles.paginationWrap}>
            <View style={styles.paginationContainer}>
              {banners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    {
                      width: currentBanner === index ? 20 : 8,
                      backgroundColor: currentBanner === index ? '#fff' : 'rgba(255,255,255,0.5)',
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        )}
      </View>
    ),
    [banners, currentBanner, handleScrollEnd],
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
        case ModuleType.CHANGE_RECORDER_CHALLENGE:
          navigation.navigate('ChangeRecorderChallenge');
          break;
        case ModuleType.FUNDRAISING_CHALLENGE:
          navigation.navigate('FundraisingChallenge');
          break;
        case ModuleType.TURNOVER_QUERY:
          navigation.navigate('TurnoverQuery');
          break;
        case ModuleType.PITCHER_RANKING:
          navigation.navigate('PitcherRanking');
          break;
        case ModuleType.CREATE_RACE:
          navigation.navigate('CreateRace');
          break;
        case ModuleType.ALL_RACE:
          navigation.navigate('AllRace');
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
        <Text style={styles.sectionTitle}>{t('home.functionMenu')}</Text>
        <View style={styles.moduleGrid}>
          {accessibleModules.map((module) => (
            <TouchableOpacity
              key={module.id}
              onPress={() => handleModulePress(module.type)}
              style={styles.moduleWrapper}
            >
              <View style={[styles.moduleButton, { backgroundColor: module.backgroundColor }]}>
                <Icon name={module.icon} size={28} color="#fff" />
              </View>
              <Text style={styles.moduleButtonText}>{t(module.title)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }, [accessibleModules, handleModulePress, t]);

  // 渲染认证状态相关内容
  const renderAuthContent = useCallback(() => {
    // 如果正在进行初始身份验证检查，显示加载指示器
    if (initCheckLogin) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text style={styles.loadingText}>{t('common.verifying')}</Text>
        </View>
      );
    }
    // 身份验证已完成，且用户未登录，显示登录按钮
    if (!isLoggedIn) {
      return (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            navigation.navigate('Auth', {
              returnScreen: 'Home',
            });
          }}
        >
          <Text style={styles.loginButtonText}>{t('common.goLogin')}</Text>
        </TouchableOpacity>
      );
    }
    // 用户已登录，不显示任何内容
    return null;
  }, [initCheckLogin, isLoggedIn, navigation, t]);

  useEffect(() => {
    // 只有在身份验证加载完成且用户未登录时才跳转
    if (!initCheckLogin && !isLoggedIn) {
      navigation.navigate('Auth', {
        returnScreen: 'Home',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={THEME_COLORS.primary} barStyle="light-content" />

      {/* 固定头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>俊龍娛樂</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {bannerContent()}
        <View style={styles.contentContainer}>
          {renderModules()}
          {renderAuthContent()}
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 20,
    height: HEADER_HEIGHT + STATUS_BAR_HEIGHT,
    backgroundColor: THEME_COLORS.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    backgroundColor: '#fff',
  },
  bannerContainer: {
    position: 'relative',
    marginTop: 10,
  },
  bannerCardContainer: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerCard: {
    width: CARD_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerTextOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  paginationWrap: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    marginLeft: 15,
    marginTop: 10,
  },
  modulesContainer: {
    paddingHorizontal: 10,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  moduleWrapper: {
    width: '25%',
    marginBottom: 20,
    alignItems: 'center',
  },
  moduleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  moduleButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  loginButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});
