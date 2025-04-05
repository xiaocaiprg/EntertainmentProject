import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getChallengeList } from '../../api/services/gameService';
import { GameMatchDto } from '../../interface/Game';
import { ChallengeStatus } from '../../interface/Common';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';

// 状态Tab选项
const STATUS_TABS = [
  { label: '募资中', value: ChallengeStatus.FUNDRAISING },
  { label: '募资完成', value: ChallengeStatus.FUNDRAISING_COMPLETED },
  { label: '进行中', value: ChallengeStatus.IN_PROGRESS },
  { label: '已结束', value: ChallengeStatus.ENDED },
  { label: '已完成', value: ChallengeStatus.COMPLETED },
];

export const AllChallengeScreen = React.memo(() => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<number>(ChallengeStatus.FUNDRAISING); // 默认选中'募资中'标签
  const [loading, setLoading] = useState<boolean>(true);
  const [challengeList, setChallengeList] = useState<GameMatchDto[]>([]);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(5).current;
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 清空列表并重置分页
  const resetList = useCallback(() => {
    setChallengeList([]);
    pageNum.current = 1;
  }, []);

  // 获取挑战列表
  const fetchChallengeList = useCallback(async () => {
    setLoading(true);
    const res = await getChallengeList({
      pageNum: pageNum.current,
      pageSize: pageSize,
      isEnabledList: [activeTab], // 根据当前选中的Tab筛选状态
    });
    setLoading(false);
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setChallengeList((prev) => [...prev, ...(res.records || [])]);
    }
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
  }, [loading, hasMore, pageNum, fetchChallengeList]);

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
    (item: GameMatchDto) => {
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item.id)} activeOpacity={0.7}>
          <View style={styles.itemContent}>
            <View style={styles.itemLeft}>
              <View style={styles.itemRow}>
                <Text style={styles.label}>创建时间:</Text>
                <Text style={styles.value}>{item.createTime || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战名称:</Text>
                <Text style={styles.value}>{item.name || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战上下水:</Text>
                <Text style={styles.value}>{item.profitStr || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>挑战转码:</Text>
                <Text style={styles.value}>{item.turnOverStr || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>投手:</Text>
                <Text style={styles.value}>{item.playPersonName || '-'}</Text>
              </View>
            </View>
            <View style={styles.arrowContainer}>
              <Icon name="chevron-right" size={20} color="#bbb" />
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [handleItemPress],
  );

  // 渲染列表底部加载状态
  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={THEME_COLORS.primary} />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  }, [loading]);

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
            <Text style={[styles.tabText, activeTab === tab.value && styles.activeTabText]}>{tab.label}</Text>
            <View style={[styles.tabLine, activeTab === tab.value && styles.activeTabLine]} />
          </TouchableOpacity>
        ))}
      </View>
    );
  }, [activeTab, handleTabChange]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>所有挑战</Text>
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
            <Text style={styles.emptyText}>暂无挑战记录</Text>
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
    height: 44,
    paddingHorizontal: 16,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  itemContainer: {
    backgroundColor: THEME_COLORS.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
    borderRadius: 8,
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
