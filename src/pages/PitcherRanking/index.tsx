import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ImageBackground,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { THEME_COLORS } from '../../utils/styles';
import { useTranslation } from '../../hooks/useTranslation';
import { InfoModal } from '../../components/InfoModal';
import FilterArea from './components/FilterArea';
import RankingListView from './components/RankingListView';
import { Nav } from './components/Nav';
import RankingRulesContent from './components/RankingRulesContent';
import {
  RankingTabType,
  PlayerHitrateRankDto,
  PlayerKillrateRankDto,
  RankSearchParam,
  RankingTypeEnum,
  RankCompanySearchParam,
  PlayerCompanyHitrateRankDto,
  PlayerCompanyKillrateRankDto,
} from '../../interface/Ranking';
import { RootStackScreenProps } from '../router';
import {
  getPitcherRankingHitRate,
  getPitcherRankingHitRateCompany,
  getPitcherRankingKillRate,
  getPitcherRankingKillRateCompany,
} from '../../api/services/rankService';

// 使用导航堆栈中定义的类型
type PitcherRankingScreenProps = RootStackScreenProps<'PitcherRanking'>;

export const PitcherRankingScreen: React.FC<PitcherRankingScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<RankingTabType>(RankingTabType.HIT_RATE);
  const [rankingType, setRankingType] = useState<RankingTypeEnum>(RankingTypeEnum.PERSONAL);
  const [selectedTimeRange, setSelectedTimeRange] = useState(7);
  const [selectedLocation, setSelectedLocation] = useState<number>(-1);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [hitRateRankData, setHitRateRankData] = useState<PlayerHitrateRankDto[]>([]);
  const [killRateRankData, setKillRateRankData] = useState<PlayerKillrateRankDto[]>([]);
  const [companyHitRateRankData, setCompanyHitRateRankData] = useState<PlayerCompanyHitrateRankDto[]>([]);
  const [companyKillRateRankData, setCompanyKillRateRankData] = useState<PlayerCompanyKillrateRankDto[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const pageNumRef = useRef(1);
  const pageSizeRef = useRef(20);
  const scrollY = useRef(new Animated.Value(0)).current;
  const requestIdRef = useRef(0);

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false,
    listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = 20;
      const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

      if (isCloseToBottom && !loading && hasMore) {
        handleLoadMore();
      }
    },
  });

  const fetchHitRateRankingData = useCallback(async () => {
    setLoading(true);
    const currentRequestId = ++requestIdRef.current;
    const params: RankSearchParam = {
      rankPeriod: selectedTimeRange,
      pageNum: pageNumRef.current,
      pageSize: pageSizeRef.current,
    };
    if (selectedLocation > 0) {
      params.addressId = selectedLocation;
    }
    const result = await getPitcherRankingHitRate(params);
    if (currentRequestId === requestIdRef.current) {
      if (result && result.records) {
        const isHasMore = result.current < result.pages;
        setHasMore(isHasMore);
        setHitRateRankData((prev) => [...prev, ...(result.records || [])]);
      }
    }
    setLoading(false);
  }, [selectedTimeRange, selectedLocation]);

  const fetchKillRateRankingData = useCallback(async () => {
    setLoading(true);
    const currentRequestId = ++requestIdRef.current;
    const params: RankSearchParam = {
      rankPeriod: selectedTimeRange,
      pageNum: pageNumRef.current,
      pageSize: pageSizeRef.current,
    };
    if (selectedLocation > 0) {
      params.addressId = selectedLocation;
    }
    const result = await getPitcherRankingKillRate(params);
    if (currentRequestId === requestIdRef.current) {
      if (result && result.records) {
        const isHasMore = result.current < result.pages;
        setHasMore(isHasMore);
        setKillRateRankData((prev) => [...prev, ...(result.records || [])]);
      }
    }
    setLoading(false);
  }, [selectedTimeRange, selectedLocation]);

  const fetchCompanyHitRateRankingData = useCallback(async () => {
    setLoading(true);
    const currentRequestId = ++requestIdRef.current;
    const params: RankCompanySearchParam = {
      rankPeriod: selectedTimeRange,
      orderParam: 'desc',
    };
    if (selectedLocation > 0) {
      params.addressId = selectedLocation;
    }
    const result = await getPitcherRankingHitRateCompany(params);
    if (currentRequestId === requestIdRef.current) {
      if (result?.length) {
        setCompanyHitRateRankData(result);
      }
    }
    setLoading(false);
  }, [selectedTimeRange, selectedLocation]);
  const fetchCompanyKillRateRankingData = useCallback(async () => {
    setLoading(true);
    const currentRequestId = ++requestIdRef.current;
    const params: RankCompanySearchParam = {
      rankPeriod: selectedTimeRange,
      orderParam: 'desc',
    };
    if (selectedLocation > 0) {
      params.addressId = selectedLocation;
    }
    const result = await getPitcherRankingKillRateCompany(params);
    if (currentRequestId === requestIdRef.current) {
      if (result?.length) {
        setCompanyKillRateRankData(result);
      }
    }
    setLoading(false);
  }, [selectedTimeRange, selectedLocation]);

  const handleTabChange = useCallback(
    (tab: RankingTabType) => {
      if (tab !== currentTab && rankingType === RankingTypeEnum.PERSONAL) {
        setHitRateRankData([]);
        setKillRateRankData([]);
      }
      if (tab !== currentTab && rankingType === RankingTypeEnum.COMPANY) {
        setCompanyHitRateRankData([]);
        setCompanyKillRateRankData([]);
      }
      setCurrentTab(tab);
    },
    [currentTab, rankingType],
  );

  // 切换公司/个人排行榜
  const handleRankingTypeChange = useCallback(
    (type: RankingTypeEnum) => {
      if (rankingType === RankingTypeEnum.COMPANY && type !== rankingType) {
        setHitRateRankData([]);
        setKillRateRankData([]);
      }
      if (rankingType === RankingTypeEnum.PERSONAL && type !== rankingType) {
        setCompanyHitRateRankData([]);
        setCompanyKillRateRankData([]);
      }
      setRankingType(type);
    },
    [rankingType],
  );

  const handleLoadMore = useCallback(() => {
    if (rankingType === RankingTypeEnum.PERSONAL && hasMore && !loading) {
      pageNumRef.current++;
      if (currentTab === RankingTabType.HIT_RATE) {
        fetchHitRateRankingData();
      } else {
        fetchKillRateRankingData();
      }
    }
  }, [rankingType, fetchHitRateRankingData, hasMore, currentTab, fetchKillRateRankingData, loading]);
  const resetData = useCallback(() => {
    pageNumRef.current = 1;
    requestIdRef.current = 0;
    setHasMore(false);
    setHitRateRankData([]);
    setKillRateRankData([]);
    setCompanyHitRateRankData([]);
    setCompanyKillRateRankData([]);
  }, []);
  useEffect(() => {
    // 重置请求状态，确保新的筛选条件开始前清空旧的请求ID
    resetData();
    if (rankingType === RankingTypeEnum.PERSONAL) {
      if (currentTab === RankingTabType.HIT_RATE) {
        fetchHitRateRankingData();
      } else {
        fetchKillRateRankingData();
      }
    } else {
      if (currentTab === RankingTabType.HIT_RATE) {
        fetchCompanyHitRateRankingData();
      } else {
        fetchCompanyKillRateRankingData();
      }
    }
  }, [
    currentTab,
    selectedTimeRange,
    selectedLocation,
    rankingType,
    fetchCompanyHitRateRankingData,
    fetchCompanyKillRateRankingData,
    fetchHitRateRankingData,
    fetchKillRateRankingData,
    resetData,
  ]);

  return (
    <View style={styles.container}>
      <Nav
        scrollY={scrollY}
        onBack={() => navigation.goBack()}
        onShowInfo={() => setShowInfoModal(true)}
        rankingType={rankingType}
        onRankingTypeChange={handleRankingTypeChange}
      />
      <Animated.ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        {/* 头部背景图片区域 */}
        <ImageBackground
          source={{ uri: 'https://junlongpro.s3.ap-southeast-1.amazonaws.com/rank3.png' }}
          style={styles.headerBackgroundImage}
          resizeMode="cover"
        >
          <View style={styles.heroSection}>
            <Text style={styles.updateInfo}>每日凌晨更新</Text>
          </View>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <FilterArea
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={(timeRange) => setSelectedTimeRange(timeRange)}
            selectedLocation={selectedLocation}
            onLocationChange={(locationId) => setSelectedLocation(locationId)}
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
            rankingType={rankingType}
            hitRateData={hitRateRankData}
            killRateData={killRateRankData}
            companyHitRateData={companyHitRateRankData}
            companyKillRateData={companyKillRateRankData}
          />
        </View>
        <View style={styles.bottomSpace} />
      </Animated.ScrollView>

      <InfoModal
        visible={showInfoModal}
        title={t('pitcher_ranking.infoTitle')}
        customContent={<RankingRulesContent />}
        onClose={() => setShowInfoModal(false)}
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
    height: 220,
    paddingBottom: 10,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
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
