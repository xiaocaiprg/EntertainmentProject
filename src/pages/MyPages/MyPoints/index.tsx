import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import CustomText from '../../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { STATUS_BAR_HEIGHT, isIOS } from '../../../utils/platform';
import { RootStackScreenProps } from '../../router';
import { useAuth } from '../../../hooks/useAuth';
import { getPointDetail } from '../../../api/services/pointService';
import { TransferLogDto, PointDetailParams } from '../../../interface/Points';
import { PointCard } from './components/PointCard';

type MyPointsScreenProps = RootStackScreenProps<'MyPoints'>;

export const MyPointsScreen: React.FC<MyPointsScreenProps> = React.memo((props) => {
  const { navigation, route } = props;
  const { user } = useAuth();
  const { code } = route?.params || {};

  const [pointsList, setPointsList] = useState<TransferLogDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const pageNum = useRef(1);
  const pageSize = useRef(10);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const getPointDetailList = useCallback(async () => {
    setLoading(true);
    const params: PointDetailParams = {
      pageNum: pageNum.current,
      pageSize: pageSize.current,
      ...(code ? { code } : {}),
    };
    const res = await getPointDetail(params);
    if (res) {
      setPointsList((prev) => [...prev, ...(res.records || [])]);
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
    }
    setLoading(false);
  }, [code]);

  useEffect(() => {
    getPointDetailList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = useCallback(({ item }: { item: TransferLogDto }) => {
    return <PointCard item={item} />;
  }, []);

  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#999" />
        <CustomText style={styles.footerText}>加载中...</CustomText>
      </View>
    );
  }, [loading]);

  const renderEmpty = useCallback(() => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <CustomText style={styles.emptyText}>暂无数据</CustomText>
      </View>
    );
  }, [loading]);

  const handleEndReached = useCallback(() => {
    if (!loading && hasMore) {
      pageNum.current += 1;
      getPointDetailList();
    }
  }, [loading, hasMore, getPointDetailList]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>积分明细</CustomText>
        <View style={{ width: 24, opacity: 0 }} />
      </View>
      {code ? null : (
        <View style={styles.pointsSummary}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <CustomText style={styles.availText}>可用:</CustomText>
            <CustomText style={styles.availablePoints}> {user?.availablePoints.toLocaleString()}</CustomText>
          </View>
          <View style={styles.pointsSummaryItem}>
            <CustomText style={styles.frozenPoints}>在途:</CustomText>
            <CustomText style={styles.frozenPoints}>{user?.frozenPoints}</CustomText>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <FlatList
          data={pointsList}
          renderItem={renderItem}
          keyExtractor={(item: TransferLogDto, index: number) => `${index}-${item.id}`}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  pointsSummary: {
    backgroundColor: '#F2EFF1',
    marginHorizontal: 15,
    marginTop: 10,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 10,
  },
  availText: {
    fontSize: 15,
    color: '#111',
    marginBottom: 3,
  },
  availablePoints: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
  },
  pointsSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 3,
  },
  frozenPoints: {
    fontSize: 15,
    color: '#999',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  footerText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
