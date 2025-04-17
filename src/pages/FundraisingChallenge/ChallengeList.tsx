import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GameMatchDto } from '../../interface/Game';
import { THEME_COLORS } from '../../utils/styles';
import { getChallengeList } from '../../api/services/gameService';
import { ChallengeStatus } from '../../interface/Common';
import { useTranslation } from '../../hooks/useTranslation';
interface ChallengeListProps {
  onItemPress: (matchId: number | undefined) => void;
  onBack: () => void;
}

export const ChallengeList: React.FC<ChallengeListProps> = React.memo((props) => {
  const { onItemPress, onBack } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [challengeList, setChallengeList] = useState<GameMatchDto[]>([]);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(10).current;
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 获取募资中的挑战列表
  const fetchChallengeList = useCallback(async () => {
    setLoading(true);
    const res = await getChallengeList({
      pageNum: pageNum.current,
      pageSize: pageSize,
      isEnabledList: [ChallengeStatus.FUNDRAISING], // 仅获取募资中的挑战
    });
    setLoading(false);
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setChallengeList((prev) => [...prev, ...(res.records || [])]);
    }
  }, [pageSize]);

  // 加载更多数据
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      pageNum.current += 1;
      fetchChallengeList();
    }
  }, [loading, hasMore, fetchChallengeList]);

  // 初始加载数据
  useEffect(() => {
    fetchChallengeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 渲染挑战项
  const renderItem = useCallback(
    (item: GameMatchDto) => {
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => onItemPress(item.id)} activeOpacity={0.7}>
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
                <Text style={styles.label}>挑战时间:</Text>
                <Text style={styles.value}>{item.gameDate || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>地点:</Text>
                <Text style={styles.value}>{item.addressName || '-'}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.label}>投手:</Text>
                <Text style={styles.value}>{item.playPersonName || '-'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.investButton} onPress={() => onItemPress(item.id)} activeOpacity={0.7}>
              <Text style={styles.investButtonText}>查看</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    },
    [onItemPress],
  );

  // 渲染列表底部加载状态
  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={THEME_COLORS.primary} />
        <Text style={styles.footerText}>{t('common.loading')}</Text>
      </View>
    );
  }, [loading, t]);

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('fundraisingChallenge.fundraisingChallenges')}</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.contentContainer}>
        {challengeList.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('fundraisingChallenge.noFundraisingChallenges')}</Text>
          </View>
        ) : (
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
        )}
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerRight: {
    width: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  itemContent: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  investButton: {
    backgroundColor: THEME_COLORS.primary,
    height: 30,
    width: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  investButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
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
    color: '#999',
  },
});
