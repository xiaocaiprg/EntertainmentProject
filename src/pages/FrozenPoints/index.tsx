import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../hooks/useTranslation';
import { RootStackScreenProps } from '../router';
import { getFrozenList } from '../../api/services/pointService';
import { GameMatch } from '../../interface/Points';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';

type FrozenPointsScreenProps = RootStackScreenProps<'FrozenPoints'>;

export const FrozenPointsScreen: React.FC<FrozenPointsScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [frozenList, setFrozenList] = useState<GameMatch[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const pageNumRef = useRef(1);
  const pageSizeRef = useRef(10);

  // 加载在途积分数据
  const loadFrozenPoints = useCallback(async () => {
    setLoading(true);
    const result = await getFrozenList({
      pageNum: pageNumRef.current,
      pageSize: pageSizeRef.current,
    });
    if (result) {
      setFrozenList((prev) => [...prev, ...result]);
      setHasMore(result.length === pageSizeRef.current);
    }
    setLoading(false);
  }, []);

  // 初始加载数据
  useEffect(() => {
    loadFrozenPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 渲染每个挑战项
  const renderItem = useCallback(
    ({ item }: { item: GameMatch }) => {
      return (
        <View style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
          </View>
          <View style={styles.itemDetail}>
            <Text style={styles.itemText}>
              {t('frozenPoints.playRuleCode')}: {item.playRuleCode}
            </Text>
          </View>
          <View style={styles.itemDetail}>
            <Text style={styles.itemText}>
              {t('frozenPoints.gameDate')}: {item.gameDate}
            </Text>
            <Text style={styles.itemText}>
              {t('frozenPoints.principal')}: {item.principal || 0}
            </Text>
          </View>
        </View>
      );
    },
    [t],
  );

  // 渲染列表底部加载更多指示器
  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#999" />
        <Text style={styles.footerText}>{t('common.loading')}</Text>
      </View>
    );
  }, [loading, t]);

  // 渲染空列表状态
  const renderEmpty = useCallback(() => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('frozenPoints.noData')}</Text>
      </View>
    );
  }, [loading, t]);

  // 处理滚动到底部事件
  const handleEndReached = useCallback(() => {
    if (!loading && hasMore) {
      pageNumRef.current += 1;
      loadFrozenPoints();
    }
  }, [loading, hasMore, loadFrozenPoints]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('frozenPoints.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={frozenList}
        renderItem={renderItem}
        keyExtractor={(item: GameMatch, index: number) => `${index}-${item.id}`}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemProfit: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  itemDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
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

export default FrozenPointsScreen;
