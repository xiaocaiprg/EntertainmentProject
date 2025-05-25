import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, StatusBar, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { getRacePoolList } from '../../api/services/raceService';
import { PoolCard } from './components/PoolCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RacePoolPageDto } from '../../interface/Race';
import { RootStackScreenProps } from '../router';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { THEME_COLORS } from '../../utils/styles';
import { useRole } from '../../hooks/useRole';
import useFocusRefresh from '../../hooks/useFocusRefresh';
import { CreateRacePoolModal } from './components/CreateRacePoolModal';
import CustomText from '../../components/CustomText';

// 奖金池卡片颜色配置
const POOL_COLORS = [
  '#3498db', // 蓝色
  '#e74c3c', // 红色
  '#2ecc71', // 绿色
  '#f39c12', // 橙色
  '#9b59b6', // 紫色
  '#1abc9c', // 蓝绿色
  '#d35400', // 深橙色
  '#c0392b', // 深红色
  '#8e44ad', // 深紫色
  '#16a085', // 深绿色
];

export const RacePoolListScreen: React.FC<RootStackScreenProps<'RacePoolList'>> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [poolList, setPoolList] = useState<RacePoolPageDto[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { isAdmin } = useRole();

  const pageNumRef = useRef<number>(1);
  const pageSizeRef = useRef<number>(10);

  // 获取奖金池列表数据
  const fetchPoolList = useCallback(async (shouldReset = false) => {
    setLoading(true);
    if (shouldReset) {
      pageNumRef.current = 1;
      setPoolList([]);
    }
    const params = {
      pageNum: pageNumRef.current,
      pageSize: pageSizeRef.current,
    };

    const res = await getRacePoolList(params);

    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setPoolList((prev) => [...prev, ...(res.records || [])]);
    }
    setLoading(false);
  }, []);

  useFocusRefresh(() => {
    fetchPoolList(true);
  });

  // 处理加载更多
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      pageNumRef.current += 1;
      fetchPoolList();
    }
  }, [loading, hasMore, fetchPoolList]);

  // 处理积分分配
  const handleDistributePoints = useCallback(
    (pool: RacePoolPageDto) => {
      if (pool.code && pool.availablePoints && pool.availablePoints > 0) {
        navigation.navigate('PointsTransfer', {
          code: pool.code,
          availablePoints: pool.availablePoints,
          name: pool.name,
        });
      }
    },
    [navigation],
  );

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenCreateModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // 渲染每个奖金池项
  const renderPoolItem = useCallback(
    ({ item, index }: { item: RacePoolPageDto; index: number }) => {
      const colorIndex = index % POOL_COLORS.length;
      return (
        <PoolCard
          pool={item}
          color={POOL_COLORS[colorIndex]}
          isAdmin={isAdmin}
          onDistribute={handleDistributePoints}
          onStatusChange={() => fetchPoolList(true)}
        />
      );
    },
    [handleDistributePoints, isAdmin, fetchPoolList],
  );

  // 渲染列表底部
  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={THEME_COLORS.primary} />
        <CustomText style={styles.footerText}>加载中...</CustomText>
      </View>
    );
  }, [loading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('racePoolList.title')}</CustomText>
        <View style={styles.headerRight} />
      </View>

      {isAdmin && (
        <TouchableOpacity onPress={handleOpenCreateModal} style={styles.createButtonContainer}>
          <CustomText style={styles.createButtonText}>{t('racePoolList.createPoolTitle')}</CustomText>
        </TouchableOpacity>
      )}
      <FlatList
        data={poolList}
        renderItem={renderPoolItem}
        keyExtractor={(item, index) => `pool-${item.code || index}`}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshing={loading}
        ListFooterComponent={renderFooter}
      />
      {poolList.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <CustomText style={styles.emptyText}>{t('racePoolList.noData')}</CustomText>
        </View>
      )}

      {modalVisible ? (
        <CreateRacePoolModal onClose={handleCloseCreateModal} onSuccess={() => fetchPoolList(true)} />
      ) : null}
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
  listContent: {
    padding: 10,
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
  createButtonContainer: {
    backgroundColor: THEME_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
    width: 150,
    height: 40,
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
