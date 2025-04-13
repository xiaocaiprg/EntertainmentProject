import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { THEME_COLORS } from '../../../utils/styles';
import { ResultListProps } from '../interface/ITurnoverQuery';
import { GameTurnOverItemDto } from '../../../interface/Game';

export const ResultList = React.memo((props: ResultListProps) => {
  const { loading, data } = props;
  const hasData = useMemo(
    () => data && data.gameTurnOverItemDtoList && data.gameTurnOverItemDtoList.length > 0,
    [data],
  );
  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <Text style={styles.totalText}>总转码: {data?.turnOverStr}</Text>
        <Text style={styles.totalText}>总上下水: {data?.profitStr}</Text>
      </View>
    ),
    [data],
  );

  const renderItem = useCallback(
    ({ item }: { item: GameTurnOverItemDto }) => (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemDate}>{item.gameDate}</Text>
        </View>
        <View style={styles.itemContent}>
          <View style={styles.statWrapper}>
            <Text style={styles.statLabel}>地址:</Text>
            <Text style={styles.statValue}>{item.addressName}</Text>
          </View>

          <View style={styles.statWrapper}>
            <Text style={styles.statLabel}>转码:</Text>
            <Text style={styles.statValue}>{item.turnOverStr}</Text>
          </View>
          <View style={styles.statWrapper}>
            <Text style={styles.statLabel}>上下水:</Text>
            <Text
              style={[
                styles.statValue,
                parseFloat(item.profitStr || '0') > 0
                  ? styles.positive
                  : parseFloat(item.profitStr || '0') < 0
                  ? styles.negative
                  : {},
              ]}
            >
              {item.profitStr || '0'}
            </Text>
          </View>
        </View>
      </View>
    ),
    [],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME_COLORS.primary} />
        <Text style={styles.loadingText}>正在加载数据...</Text>
      </View>
    );
  }
  if (!hasData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>暂无数据</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={data?.gameTurnOverItemDtoList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  listContent: {
    paddingHorizontal: 15,
  },
  itemContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  itemDate: {
    fontSize: 14,
    color: '#777',
  },
  itemContent: {
    marginTop: 5,
  },
  statWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  positive: {
    color: '#2ecc71',
  },
  negative: {
    color: '#e74c3c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
