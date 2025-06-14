import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../../components/CustomText';
import { useTranslation } from '../../hooks/useTranslation';
import { getChallengeList } from '../../api/services/gameService';
import { ChallengeListParams, GameMatchPageDto } from '../../interface/Game';
import { ChallengeStatus, IsInside, FundraisingType } from '../../interface/Common';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';
import { getStatusText } from '../../public/Game';

export const AllChallengeScreen = React.memo(() => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(-1); // 默认选中'全部'标签
  const [challengeList, setChallengeList] = useState<GameMatchPageDto[]>([]);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(10).current;
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const STATUS_TABS = useMemo(
    () => [
      { label: t('allChallenge.tabs.all'), value: -1 },
      { label: t('allChallenge.tabs.fundraising'), value: ChallengeStatus.FUNDRAISING },
      { label: t('allChallenge.tabs.fundraisingCompleted'), value: ChallengeStatus.FUNDRAISING_COMPLETED },
      { label: t('allChallenge.tabs.inProgress'), value: ChallengeStatus.IN_PROGRESS },
      { label: t('allChallenge.tabs.ended'), value: ChallengeStatus.ENDED },
      { label: t('allChallenge.tabs.completed'), value: ChallengeStatus.COMPLETED },
    ],
    [t],
  );

  // 清空列表并重置分页
  const resetList = useCallback(() => {
    setChallengeList([]);
    pageNum.current = 1;
  }, []);

  // 获取挑战列表
  const fetchChallengeList = useCallback(async () => {
    setLoading(true);
    const params: ChallengeListParams = {
      pageNum: pageNum.current,
      pageSize: pageSize,
    };

    // 只有在非全部选项时才传递isEnabledList参数
    if (activeTab !== -1) {
      params.isEnabledList = [activeTab];
    }

    const res = await getChallengeList(params);
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setChallengeList((prev) => [...prev, ...(res.records || [])]);
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
      fetchChallengeList();
    }
  }, [loading, hasMore, fetchChallengeList]);

  useEffect(() => {
    fetchChallengeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // 点击挑战项，跳转到详情页
  const handleItemPress = useCallback(
    (matchId: number | undefined) => {
      if (matchId) {
        navigation.navigate('ChallengeDetail', { matchId });
      }
    },
    [navigation],
  );

  // 渲染挑战项
  const renderItem = useCallback(
    (item: GameMatchPageDto) => {
      const status = getStatusText(item.isEnabled);
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item.id)} activeOpacity={0.7}>
          <View style={styles.itemHeader}>
            <CustomText style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
              {item.name || '-'}
            </CustomText>
            {item?.raceName && (
              <CustomText numberOfLines={1} style={[styles.itemName, { fontSize: 14 }]}>
                {item.raceName || '-'}
              </CustomText>
            )}
            <View style={[styles.statusTag, { backgroundColor: status.color + '20' }]}>
              <CustomText style={[styles.statusText, { color: status.color }]}>{status.text}</CustomText>
            </View>
          </View>

          <View style={styles.itemContent}>
            <View style={styles.itemLeft}>
              <View style={styles.itemRow}>
                <>
                  <CustomText style={styles.label}>{t('allChallenge.time')}:</CustomText>
                  <CustomText numberOfLines={1} style={[styles.value, { width: 100 }]}>
                    {item.gameDate || '-'}
                  </CustomText>
                </>
                <>
                  <CustomText style={styles.label}>{t('allChallenge.principal')}:</CustomText>
                  <CustomText style={styles.value}>{item.principal || '-'}</CustomText>
                </>
              </View>
              <View style={styles.itemRow}>
                <>
                  <CustomText style={styles.label}>{t('allChallenge.location')}:</CustomText>
                  <CustomText numberOfLines={1} style={[styles.value, { width: 100 }]}>
                    {item.addressName || '-'}
                  </CustomText>
                </>
                <>
                  <CustomText style={styles.label}>{t('allChallenge.pitcher')}:</CustomText>
                  <CustomText style={styles.value}>{item.playPersonName || '-'}</CustomText>
                </>
              </View>
              <View style={styles.itemRow}>
                <>
                  <CustomText style={styles.label}>{t('allChallenge.playRule')}:</CustomText>
                  <CustomText numberOfLines={1} style={[styles.value, { width: 100 }]}>
                    {item.playRuleName || '-'}
                  </CustomText>
                </>
                <>
                  <CustomText style={styles.label}>{t('allChallenge.investPersonName')}:</CustomText>
                  <CustomText numberOfLines={1} style={[styles.value, { width: 100 }]}>
                    {item.investPersonName || '-'}
                  </CustomText>
                </>
              </View>

              <View style={styles.itemRow}>
                <>
                  <CustomText style={styles.label}>{t('allChallenge.contributionType')}:</CustomText>
                  <CustomText numberOfLines={1} style={[styles.value, { width: 100 }]}>
                    {item.contributionType === FundraisingType.PUBLIC
                      ? t('allChallenge.public')
                      : t('allChallenge.targeted')}
                  </CustomText>
                </>
                {item.isInside === IsInside.OUTSIDE ? (
                  <>
                    <CustomText style={styles.label}>{t('allChallenge.isInside')}:</CustomText>
                    <CustomText numberOfLines={1} style={[styles.value, { width: 100 }]}>
                      {t('allChallenge.outside')}
                    </CustomText>
                  </>
                ) : null}
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
        <CustomText style={styles.footerText}>{t('allChallenge.loading')}</CustomText>
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
              {tab.label}
            </CustomText>
            <View style={[styles.tabLine, activeTab === tab.value && styles.activeTabLine]} />
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [activeTab, handleTabChange, STATUS_TABS]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('allChallenge.title')}</CustomText>
        <View style={styles.headerRight} />
      </View>

      {renderTabs()}

      <View style={styles.container}>
        <FlatList
          data={challengeList}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => `${String(item.id)}_${item.createTime}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshing={loading}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
        />
        {challengeList.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>{t('allChallenge.noData')}</CustomText>
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
  backButton: {
    padding: 6,
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
    paddingBottom: 6,
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
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
    width: 50,
  },
  value: {
    fontSize: 14,
    color: THEME_COLORS.text.primary,
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
