import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { RootStackScreenProps } from '../../router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getRaceList } from '../../../api/services/raceService';
import { RaceListParams, RacePageDto, RaceStatus } from '../../../interface/Race';
import { STATUS_BAR_HEIGHT, isIOS } from '../../../utils/platform';
import CustomText from '../../../components/CustomText';
import { THEME_COLORS } from '../../../utils/styles';
import { getRaceStatusText } from '../../../public/Race';
import { useTranslation } from '../../../hooks/useTranslation';

// 状态Tab选项
const STATUS_TABS = [
  { label: 'all', value: RaceStatus.ALL },
  { label: 'inProgress', value: RaceStatus.IN_PROGRESS },
  //   { label: '已结束', value: RaceStatus.ENDED },
];

export const AllRaceScreen: React.FC<RootStackScreenProps<'AllRace'>> = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(RaceStatus.ALL); // 默认选中'全部'标签
  const [raceList, setRaceList] = useState<RacePageDto[]>([]);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(5).current;
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // 清空列表并重置分页
  const resetList = useCallback(() => {
    setRaceList([]);
    pageNum.current = 1;
  }, []);

  // 获取比赛列表
  const fetchRaceList = useCallback(async () => {
    setLoading(true);
    const params: RaceListParams = {
      pageNum: pageNum.current,
      pageSize: pageSize,
    };

    // 只有在非全部选项时才传递isEnabledList参数
    if (activeTab !== RaceStatus.ALL) {
      params.isEnabledList = [activeTab];
    }

    const res = await getRaceList(params);
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setRaceList((prev) => [...prev, ...(res.records || [])]);
    }
    setLoading(false);
  }, [pageNum, pageSize, activeTab]);

  // 切换Tab时重置列表并获取数据
  const handleTabChange = useCallback(
    (tabValue: number) => {
      if (activeTab !== tabValue) {
        setActiveTab(tabValue);
        resetList();
      }
    },
    [activeTab, resetList],
  );

  // 加载更多数据
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      pageNum.current += 1;
      fetchRaceList();
    }
  }, [loading, hasMore, fetchRaceList]);

  useEffect(() => {
    fetchRaceList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // 点击比赛项，发起挑战按钮处理
  const handleItemPress = useCallback(
    (raceId: number | undefined) => {
      if (raceId) {
        navigation.navigate('RaceDetail', { raceId });
      }
    },
    [navigation],
  );

  // 渲染比赛项
  const renderItem = useCallback(
    (item: RacePageDto) => {
      const status = getRaceStatusText(item.isEnabled || 0);
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item.id)} activeOpacity={0.7}>
          <View style={styles.itemHeader}>
            <CustomText style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
              {item.name || '-'}
            </CustomText>
            <View style={[styles.statusTag, { backgroundColor: status.color + '20' }]}>
              <CustomText style={[styles.statusText, { color: status.color }]}>{status.text}</CustomText>
            </View>
          </View>

          <View style={styles.itemContent}>
            <View style={styles.itemLeft}>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>{t('allRace.startTime')}:</CustomText>
                <CustomText style={styles.value}>{item.beginDate || '-'}</CustomText>
              </View>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>{t('allRace.endTime')}:</CustomText>
                <CustomText style={styles.value}>{item.endDate || '-'}</CustomText>
              </View>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>{t('allRace.raceRule')}:</CustomText>
                <CustomText style={styles.value}>{item.playRuleName || '-'}</CustomText>
              </View>
              <View style={styles.itemRow}>
                <CustomText style={styles.label}>{t('allRace.turnOverLimit')}:</CustomText>
                <CustomText style={styles.value}>{item.turnOverLimit || '-'}</CustomText>
              </View>
            </View>
            <View style={styles.arrowContainer}>
              <Icon name="chevron-right" size={20} color="#bbb" />
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [handleItemPress, t],
  );

  // 渲染列表底部加载状态
  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={THEME_COLORS.primary} />
        <CustomText style={styles.footerText}>{t('allRace.loading')}</CustomText>
      </View>
    );
  }, [loading, t]);

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 渲染状态选项卡
  const renderTabs = useCallback(() => {
    return (
      <View style={styles.tabsContainer}>
        {STATUS_TABS.map((tab) => (
          <TouchableOpacity key={tab.value} style={styles.tabItem} onPress={() => handleTabChange(tab.value)}>
            <CustomText style={[styles.tabText, activeTab === tab.value && styles.activeTabText]}>
              {t(`allRace.tabs.${tab.label}`)}
            </CustomText>
            <View style={[styles.tabLine, activeTab === tab.value && styles.activeTabLine]} />
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [activeTab, handleTabChange, t]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('allRace.title')}</CustomText>
        <View style={styles.headerRight} />
      </View>

      {renderTabs()}

      <View style={styles.container}>
        <FlatList
          data={raceList}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => `${String(item.id)}_${item.name}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshing={loading}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
        />
        {raceList.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>{t('allRace.noData')}</CustomText>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  headerRight: {
    width: 36,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    color: THEME_COLORS.text.light,
    fontWeight: '400',
  },
  tabLine: {
    height: 4,
    width: 40,
    marginTop: 4,
  },
  activeTabLine: {
    borderRadius: 10,
    backgroundColor: THEME_COLORS.primary,
  },
  activeTabText: {
    fontWeight: '600',
    color: THEME_COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: THEME_COLORS.cardBackground,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 2,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
    paddingBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME_COLORS.text.primary,
    flex: 1,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemContent: {
    flexDirection: 'row',
  },
  itemLeft: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: THEME_COLORS.text.primary,
    flex: 1,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  footerContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: THEME_COLORS.text.light,
  },
  emptyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: THEME_COLORS.text.light,
    marginTop: 12,
  },
});
