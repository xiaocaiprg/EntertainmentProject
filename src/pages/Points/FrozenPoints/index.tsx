import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../../hooks/useTranslation';
import { RootStackScreenProps } from '../../router';
import { getFrozenList } from '../../../api/services/pointService';
import { FrozeningDto } from '../../../interface/Points';
import { STATUS_BAR_HEIGHT, isIOS } from '../../../utils/platform';
import CustomText from '../../../components/CustomText';

type FrozenPointsScreenProps = RootStackScreenProps<'FrozenPoints'>;

export const FrozenPointsScreen: React.FC<FrozenPointsScreenProps> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [frozenList, setFrozenList] = useState<FrozeningDto[]>([]);

  // 加载在途积分数据
  const loadFrozenPoints = useCallback(async () => {
    setLoading(true);
    const result = await getFrozenList();
    if (result) {
      setFrozenList((prev) => [...prev, ...result]);
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
    ({ item }: { item: FrozeningDto }) => {
      return (
        <View style={styles.itemContainer}>
          <View style={styles.itemHeader}>
            <CustomText style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </CustomText>
          </View>
          <View style={styles.itemDetail}>
            <CustomText style={styles.itemText}>
              {t('frozenPoints.amount')}: {item.amount} {item.currency && `(${item.currency})`}
            </CustomText>
            <CustomText style={styles.itemText}>
              {t('frozenPoints.playPersonName')}: {item.playPersonName || '-'}
            </CustomText>
          </View>
          <View style={styles.itemDetail}>
            <CustomText style={styles.itemText}>
              {t('frozenPoints.gameDate')}: {item.gameDate}
            </CustomText>
            <CustomText style={styles.itemText}>
              {t('frozenPoints.addressName')}: {item.addressName || '-'}
            </CustomText>
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
        <CustomText style={styles.footerText}>{t('common.loading')}</CustomText>
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
        <CustomText style={styles.emptyText}>{t('frozenPoints.noData')}</CustomText>
      </View>
    );
  }, [loading, t]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('frozenPoints.title')}</CustomText>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={frozenList}
        renderItem={renderItem}
        keyExtractor={(item: FrozeningDto, index: number) => `${index}-${item.id}`}
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
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
