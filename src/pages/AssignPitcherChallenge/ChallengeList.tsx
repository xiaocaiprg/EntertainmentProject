import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getChallengeList } from '../../api/services/gameService';
import { GameMatchPageDto, ChallengeListParams } from '../../interface/Game';
import { ChallengeStatus } from '../../interface/Common';
import { THEME_COLORS } from '../../utils/styles';
import { ChallengeCard } from './components/ChallengeCard';
import { useTranslation } from '../../hooks/useTranslation';
import CustomText from '../../components/CustomText';

interface ChallengeListProps {
  onItemPress: (matchId: number | undefined) => void;
  onBack: () => void;
}

export const ChallengeList = React.memo((props: ChallengeListProps) => {
  const { onItemPress, onBack } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [challengeList, setChallengeList] = useState<GameMatchPageDto[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(10);

  // 获取挑战列表
  const fetchChallengeList = useCallback(async () => {
    setLoading(true);
    const params: ChallengeListParams = {
      pageNum: pageNum.current,
      pageSize: pageSize.current,
      isEnabledList: [ChallengeStatus.FUNDRAISING, ChallengeStatus.FUNDRAISING_COMPLETED],
    };
    const res = await getChallengeList(params);
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setChallengeList((prev) => [...prev, ...(res.records || [])]);
    }
    setLoading(false);
  }, []);

  // 加载更多挑战
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

  // 渲染列表底部加载状态
  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={THEME_COLORS.primary} />
        <CustomText style={styles.footerText}>{t('common.loading')}</CustomText>
      </View>
    );
  }, [loading, t]);

  // 渲染挑战项
  const renderItem = useCallback(
    (item: GameMatchPageDto) => <ChallengeCard item={item} onEditPress={onItemPress} />,
    [onItemPress],
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('assignPitcher.title')}</CustomText>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <FlatList
          data={challengeList}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item) => `${String(item.id)}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          refreshing={loading}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
        />
        {challengeList.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>{t('assignPitcher.noChallenges')}</CustomText>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 36,
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 10,
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
    color: '#666',
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
