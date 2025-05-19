import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, ActivityIndicator } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { STATUS_BAR_HEIGHT, SCREEN_WIDTH } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import { getUserAccessibleModules } from '../../utils/moduleLogic';
import { ModuleType } from '../../interface/Role';
import { useTranslation } from '../../hooks/useTranslation';
import LinearGradient from 'react-native-linear-gradient';
import { PeakRecordPromo } from './components/PeakRecordPromo';
import { HotActivities } from './components/HotActivities';
import CustomText from '../../components/CustomText';

const BANNER_HEIGHT = 150;
const HEADER_HEIGHT = 35;
const CARD_WIDTH = SCREEN_WIDTH - 30;

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
        title: '精彩对局',
        subtitle: '参与最新挑战赛事',
      },
      {
        id: 2,
        image: 'https://junlongpro.s3.ap-southeast-1.amazonaws.com/puzzle.jpg',
        title: '策略制胜',
        subtitle: '查看最新玩法规则',
      },
      {
        id: 3,
        image: 'https://junlongpro.s3.ap-southeast-1.amazonaws.com/macao.jpg',
        title: '澳门风采',
        subtitle: '感受独特氛围',
      },
    ],
    [],
  );

  // 功能图标数据
  const moduleIcons = useMemo(() => {
    return {
      [ModuleType.CHALLENGE_NEW]: {
        icon: 'plus-circle',
        gradient: ['#4e54c8', '#8f94fb'],
      },
      [ModuleType.CHALLENGE_EXISTING]: {
        icon: 'clipboard-list',
        gradient: ['#11998e', '#38ef7d'],
      },
      [ModuleType.ALL_CHALLENGE]: {
        icon: 'list-alt',
        gradient: ['#f46b45', '#eea849'],
      },
      [ModuleType.CHANGE_RECORDER_CHALLENGE]: {
        icon: 'exchange-alt',
        gradient: ['#614385', '#516395'],
      },
      [ModuleType.FUNDRAISING_CHALLENGE]: {
        icon: 'hand-holding-usd',
        gradient: ['#fc4a1a', '#f7b733'],
      },
      [ModuleType.TURNOVER_QUERY]: {
        icon: 'search-dollar',
        gradient: ['#12c2e9', '#c471ed'],
      },
      [ModuleType.PITCHER_RANKING]: {
        icon: 'trophy',
        gradient: ['#b24592', '#f15f79'],
      },
      [ModuleType.CREATE_RACE]: {
        icon: 'plus-square',
        gradient: ['#2193b0', '#6dd5ed'],
      },
      [ModuleType.ALL_RACE]: {
        icon: 'flag-checkered',
        gradient: ['#ee9ca7', '#ffdde1'],
      },
      [ModuleType.RACE_POOL_LIST]: {
        icon: 'coins',
        gradient: ['#396afc', '#2948ff'],
      },
    };
  }, []);

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
                <View style={styles.bannerTextOverlay}>
                  <CustomText style={styles.bannerTitle}>{banner.title}</CustomText>
                  <CustomText style={styles.bannerSubtitle}>{banner.subtitle}</CustomText>
                </View>
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
        case ModuleType.RACE_POOL_LIST:
          navigation.navigate('RacePoolList');
          break;
        default:
          break;
      }
    },
    [navigation],
  );

  // 根据模块配置渲染模块
  const renderModules = useCallback(() => {
    // 分组模块
    const moduleGroups = [
      {
        title: t('home.challengeGroup'),
        modules: accessibleModules.filter((m) =>
          [
            ModuleType.CHALLENGE_NEW,
            ModuleType.CHALLENGE_EXISTING,
            ModuleType.ALL_CHALLENGE,
            ModuleType.CHANGE_RECORDER_CHALLENGE,
            ModuleType.FUNDRAISING_CHALLENGE,
            ModuleType.CREATE_RACE,
            ModuleType.ALL_RACE,
            ModuleType.RACE_POOL_LIST,
          ].includes(m.type),
        ),
      },
      {
        title: t('home.managementGroup'),
        modules: accessibleModules.filter((m) =>
          [ModuleType.TURNOVER_QUERY, ModuleType.PITCHER_RANKING].includes(m.type),
        ),
      },
      // {
      //   title: t('home.raceGroup'),
      //   modules: accessibleModules.filter((m) =>
      //     [ModuleType.CREATE_RACE, ModuleType.ALL_RACE, ModuleType.RACE_POOL_LIST].includes(m.type),
      //   ),
      // },
    ];

    // 构建图标名称映射
    const getIconName = (moduleType: ModuleType) => {
      const iconMap: Record<ModuleType, string> = {
        [ModuleType.CHALLENGE_NEW]: 'plus-circle',
        [ModuleType.CHALLENGE_EXISTING]: 'clipboard-list',
        [ModuleType.ALL_CHALLENGE]: 'list-alt',
        [ModuleType.CHANGE_RECORDER_CHALLENGE]: 'exchange-alt',
        [ModuleType.FUNDRAISING_CHALLENGE]: 'hand-holding-usd',
        [ModuleType.TURNOVER_QUERY]: 'search-dollar',
        [ModuleType.PITCHER_RANKING]: 'trophy',
        [ModuleType.CREATE_RACE]: 'plus-square',
        [ModuleType.ALL_RACE]: 'flag-checkered',
        [ModuleType.RACE_POOL_LIST]: 'coins',
      };

      return iconMap[moduleType] || 'star';
    };

    return (
      <View style={styles.modulesContainer}>
        {moduleGroups.map(
          (group, groupIndex) =>
            group.modules.length > 0 && (
              <View key={groupIndex}>
                <CustomText style={styles.groupTitle}>{group.title}</CustomText>
                <View style={styles.moduleGrid}>
                  {group.modules.map((module) => (
                    <TouchableOpacity
                      key={module.id}
                      onPress={() => handleModulePress(module.type)}
                      style={styles.moduleWrapper}
                    >
                      <LinearGradient
                        colors={moduleIcons[module.type]?.gradient}
                        style={styles.moduleButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <FontAwesome5 name={getIconName(module.type)} size={20} color="#fff" solid />
                      </LinearGradient>
                      <CustomText style={styles.moduleButtonText}>{t(module.title)}</CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ),
        )}
      </View>
    );
  }, [accessibleModules, handleModulePress, moduleIcons, t]);

  // 渲染认证状态相关内容
  const renderAuthContent = useCallback(() => {
    // 如果正在进行初始身份验证检查，显示加载指示器
    if (initCheckLogin) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <CustomText style={styles.loadingText}>{t('common.verifying')}</CustomText>
        </View>
      );
    }
    // 身份验证已完成，且用户未登录，显示登录按钮
    if (!isLoggedIn) {
      return (
        <LinearGradient
          colors={['#4e54c8', '#8f94fb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.loginButton}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Auth', {
                returnScreen: 'Home',
              });
            }}
            style={styles.loginButtonInner}
          >
            <FontAwesome5 name="sign-in-alt" size={20} color="#fff" style={{ marginRight: 10 }} />
            <CustomText style={styles.loginButtonText}>{t('common.goLogin')}</CustomText>
          </TouchableOpacity>
        </LinearGradient>
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
      <LinearGradient colors={['#764ba2', '#667eea']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
        <View style={styles.headerContent}>
          <CustomText style={styles.headerTitle}>俊龍娛樂</CustomText>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {bannerContent()}
        <View style={styles.contentContainer}>
          <PeakRecordPromo navigation={navigation} />
          <HotActivities />
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: HEADER_HEIGHT + STATUS_BAR_HEIGHT,
  },
  headerContent: {
    flex: 1,
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    backgroundColor: '#f8f9fa',
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
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 11,
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
  groupTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  modulesContainer: {
    paddingHorizontal: 20,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  moduleWrapper: {
    width: 60,
    marginRight: 10,
    marginBottom: 10,
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
    borderRadius: 25,
  },
  loginButtonInner: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 30,
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
