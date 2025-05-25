import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { RootStackScreenProps } from '../router';
import { useAuth } from '../../hooks/useAuth';
import { getProfitList } from '../../api/services/pointService';
import { ProfitDto } from '../../interface/Points';
import { ProfitCard } from './components/ProfitCard';

type MyProfitScreenProps = RootStackScreenProps<'MyProfit'>;

export const MyProfitScreen: React.FC<MyProfitScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { user } = useAuth();

  const [profitList, setProfitList] = useState<ProfitDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const pageNum = useRef(1);
  const pageSize = useRef(20);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const getProfitDetailList = useCallback(async () => {
    setLoading(true);
    const res = await getProfitList({ pageNum: pageNum.current, pageSize: pageSize.current });
    if (res) {
      setProfitList((prev) => [...prev, ...(res.records || [])]);
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    getProfitDetailList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = useCallback(({ item }: { item: ProfitDto }) => {
    return <ProfitCard item={item} />;
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
      getProfitDetailList();
    }
  }, [loading, hasMore, getProfitDetailList]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>盈利明细</CustomText>
        <View style={{ width: 24, opacity: 0 }} />
      </View>

      <View style={styles.profitSummary}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <CustomText style={styles.totalText}>总盈利:</CustomText>
          <CustomText style={styles.totalProfit}>{user?.profitStr}</CustomText>
          <CustomText style={styles.totalText}>(HKD)</CustomText>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={profitList}
          renderItem={renderItem}
          keyExtractor={(item: ProfitDto, index: number) => `${index}-${item.matchId}`}
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  profitSummary: {
    backgroundColor: '#F2EFF1',
    marginHorizontal: 15,
    marginTop: 10,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 10,
  },
  totalText: {
    fontSize: 15,
    color: '#111',
    marginBottom: 3,
  },
  totalProfit: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
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
