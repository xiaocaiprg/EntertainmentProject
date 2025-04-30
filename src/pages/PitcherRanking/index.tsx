import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import { THEME_COLORS } from '../../utils/styles';
import { useTranslation } from '../../hooks/useTranslation';
import { InfoModal } from '../../components/InfoModal';
import FilterArea from './components/FilterArea';
import RankingListView from './components/RankingListView';
import { Nav } from './components/Nav';
import { RankingTabType, PlayerHitrateRankDto, PlayerKillrateRankDto, RankSearchParam } from '../../interface/Ranking';
import { RootStackScreenProps } from '../router';
import { getPitcherRankingHitRate, getPitcherRankingKillRate } from '../../api/services/rankService';

// 榜单描述说明
const RANKING_DESCRIPTION = `
榜单说明：
1. 命中率 = 胜局数 / 总局数
2. 杀数 = 胜局数
3. 数据统计周期为近一个月
4. 榜单每日更新一次
5. 最少参与30局才能上榜
`;

// 使用导航堆栈中定义的类型
type PitcherRankingScreenProps = RootStackScreenProps<'PitcherRanking'>;

export const PitcherRankingScreen: React.FC<PitcherRankingScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<RankingTabType>(RankingTabType.HIT_RATE);

  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [selectedLocation, setSelectedLocation] = useState<number>(0);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [hitRateRankData, setHitRateRankData] = useState<PlayerHitrateRankDto[]>([]);
  const [killRateRankData, setKillRateRankData] = useState<PlayerKillrateRankDto[]>([]);

  const pageNumRef = useRef(1);
  const pageSizeRef = useRef(20);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false });

  // 获取命中率榜数据
  const fetchHitRateRankingData = useCallback(async () => {
    setLoading(true);
    const params: RankSearchParam = {
      rankPeriod: parseInt(selectedTimeRange, 10),
      pageNum: pageNumRef.current,
      pageSize: pageSizeRef.current,
    };

    // 只有当选择了有效地点时才添加地点过滤参数
    if (selectedLocation > 0) {
      params.addressId = selectedLocation;
    }

    const result = await getPitcherRankingHitRate(params);
    if (result && result.records) {
      setHitRateRankData(result.records);
    }
    setLoading(false);
  }, [selectedTimeRange, selectedLocation]);

  // 获取杀数榜数据
  const fetchKillRateRankingData = useCallback(async () => {
    setLoading(true);
    const params: RankSearchParam = {
      rankPeriod: parseInt(selectedTimeRange, 10),
      pageNum: pageNumRef.current,
      pageSize: pageSizeRef.current,
    };

    // 只有当选择了有效地点时才添加地点过滤参数
    if (selectedLocation > 0) {
      params.addressId = selectedLocation;
    }

    const result = await getPitcherRankingKillRate(params);
    if (result && result.records) {
      setKillRateRankData(result.records);
    }

    setLoading(false);
  }, [selectedTimeRange, selectedLocation]);

  // 初始加载数据
  useEffect(() => {
    // 同时获取两种榜单数据
    const loadInitialData = async () => {
      setLoading(true);
      await fetchHitRateRankingData();
      setLoading(false);
    };
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 切换tab
  const handleTabChange = useCallback(
    (tab: RankingTabType) => {
      setCurrentTab(tab);
      setHitRateRankData([]);
      setKillRateRankData([]);
      // 每次切换标签都刷新当前标签的数据
      if (tab === RankingTabType.HIT_RATE) {
        pageNumRef.current = 1;
        fetchHitRateRankingData();
      } else {
        pageNumRef.current = 1;
        fetchKillRateRankingData();
      }
    },
    [fetchHitRateRankingData, fetchKillRateRankingData],
  );

  // 时间范围变更
  const handleTimeRangeChange = useCallback(
    (timeRange: string) => {
      setSelectedTimeRange(timeRange);
      // 时间范围变更时重新获取当前标签的数据
      if (currentTab === RankingTabType.HIT_RATE) {
        pageNumRef.current = 1;
        fetchHitRateRankingData();
      } else {
        pageNumRef.current = 1;
        fetchKillRateRankingData();
      }
    },
    [currentTab, fetchHitRateRankingData, fetchKillRateRankingData],
  );

  // 地点选择变更
  const handleLocationChange = useCallback(
    (locationId: number) => {
      setSelectedLocation(locationId);
      // 地点变更时重新获取当前标签的数据
      if (currentTab === RankingTabType.HIT_RATE) {
        pageNumRef.current = 1;
        fetchHitRateRankingData();
      } else {
        pageNumRef.current = 1;
        fetchKillRateRankingData();
      }
    },
    [currentTab, fetchHitRateRankingData, fetchKillRateRankingData],
  );

  // 返回上一页
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 显示说明弹窗
  const handleShowInfo = useCallback(() => {
    setShowInfoModal(true);
  }, []);

  // 关闭说明弹窗
  const handleCloseInfo = useCallback(() => {
    setShowInfoModal(false);
  }, []);

  return (
    <View style={styles.container}>
      <Nav scrollY={scrollY} onBack={handleBack} onShowInfo={handleShowInfo} />
      <Animated.ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        {/* 头部背景图片区域 */}
        <ImageBackground
          source={{ uri: 'https://junlongpro.s3.ap-southeast-1.amazonaws.com/rank2.png' }}
          style={styles.headerBackgroundImage}
          resizeMode="cover"
        >
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>投手榜</Text>
            <Text style={styles.updateInfo}>4月27日更新 · 按近7天商户综合人气排序</Text>
          </View>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <FilterArea
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={handleTimeRangeChange}
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
          />

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                currentTab === RankingTabType.HIT_RATE && styles.activeTabButton,
                { marginRight: 10 },
              ]}
              onPress={() => handleTabChange(RankingTabType.HIT_RATE)}
            >
              <Text
                style={[styles.tabButtonText, currentTab === RankingTabType.HIT_RATE && styles.activeTabButtonText]}
              >
                {t('pitcher_ranking.hitRateTab')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, currentTab === RankingTabType.KILL_COUNT && styles.activeTabButton]}
              onPress={() => handleTabChange(RankingTabType.KILL_COUNT)}
            >
              <Text
                style={[styles.tabButtonText, currentTab === RankingTabType.KILL_COUNT && styles.activeTabButtonText]}
              >
                {t('pitcher_ranking.killCountTab')}
              </Text>
            </TouchableOpacity>
          </View>

          <RankingListView
            loading={loading}
            currentTab={currentTab}
            hitRateData={hitRateRankData}
            killRateData={killRateRankData}
          />
        </View>
        <View style={styles.bottomSpace} />
      </Animated.ScrollView>

      <InfoModal
        visible={showInfoModal}
        title={t('pitcher_ranking.infoTitle')}
        content={RANKING_DESCRIPTION}
        onClose={handleCloseInfo}
      />
    </View>
  );
});

export default PitcherRankingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  headerBackgroundImage: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: 200,
    paddingBottom: 10,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  updateInfo: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 40,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 5,
    marginTop: -20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 35,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
  },
  activeTabButton: {
    backgroundColor: THEME_COLORS.primary,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  bottomSpace: {
    height: 50,
  },
});
