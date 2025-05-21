import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GameMatchPageDto } from '../../interface/Game';
import { THEME_COLORS } from '../../utils/styles';
import { getChallengeList } from '../../api/services/gameService';
import { ChallengeStatus } from '../../interface/Common';
import { useTranslation } from '../../hooks/useTranslation';
import CustomText from '../../components/CustomText';
interface ChallengeListProps {
  onItemPress: (matchId: number | undefined) => void;
  onBack: () => void;
}

export const ChallengeList: React.FC<ChallengeListProps> = React.memo((props) => {
  const { onItemPress, onBack } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [challengeList, setChallengeList] = useState<GameMatchPageDto[]>([]);
  const pageNum = useRef<number>(1);
  const pageSize = useRef<number>(10).current;
  const [hasMore, setHasMore] = useState<boolean>(false);

  // 获取募资中的挑战列表
  const fetchChallengeList = useCallback(async () => {
    setLoading(true);
    const res = await getChallengeList({
      pageNum: pageNum.current,
      pageSize: pageSize,
      isEnabledList: [ChallengeStatus.FUNDRAISING], // 仅获取募资中的挑战
    });
    if (res) {
      const isHasMore = res.current < res.pages;
      setHasMore(isHasMore);
      setChallengeList((prev) => [...prev, ...(res.records || [])]);
    }
    setLoading(false);
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
    (item: GameMatchPageDto) => {
      return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => onItemPress(item.id)} activeOpacity={0.7}>
          <View style={styles.itemContent}>
            <View style={styles.itemTop}>
              <View style={styles.itemRow}>
                <View style={styles.itemSubRow}>
                  <CustomText style={styles.label}>挑战:</CustomText>
                  <CustomText style={styles.value} numberOfLines={1}>
                    {item.name || '-'}
                  </CustomText>
                </View>
                <View style={styles.itemSubRow}>
                  <CustomText style={styles.label}>时间:</CustomText>
                  <CustomText style={styles.value} numberOfLines={1}>
                    {item.gameDate || '-'}
                  </CustomText>
                </View>
              </View>
              <View style={styles.itemRow}>
                {item.raceName ? (
                  <View style={styles.itemSubRow}>
                    <CustomText style={styles.label}>比赛:</CustomText>
                    <CustomText style={styles.value} numberOfLines={1}>
                      {item.raceName || '-'}
                    </CustomText>
                  </View>
                ) : null}
                <View style={styles.itemSubRow}>
                  <CustomText style={styles.label}>地点:</CustomText>
                  <CustomText style={styles.value} numberOfLines={1}>
                    {item.addressName || '-'}
                  </CustomText>
                </View>
              </View>
              <View style={styles.itemRow}>
                <View style={styles.itemSubRow}>
                  <CustomText style={styles.label}>本金:</CustomText>
                  <CustomText style={styles.value}>{item.principal || '-'}</CustomText>
                </View>
                <View style={styles.itemSubRow}>
                  <CustomText style={styles.label}>投手:</CustomText>
                  <CustomText style={styles.value}>{item.playPersonName || '-'}</CustomText>
                </View>
              </View>
              <View style={styles.itemRow}>
                <View style={styles.itemSubRow}>
                  <CustomText style={styles.label}>打法:</CustomText>
                  <CustomText style={styles.value} numberOfLines={1}>
                    {item.playRuleName || '-'}
                  </CustomText>
                </View>
                <View style={styles.itemSubRow}>
                  <CustomText style={styles.label}>币种:</CustomText>
                  <CustomText style={styles.value} numberOfLines={1}>
                    {item.currency || '-'}
                  </CustomText>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.investButton} onPress={() => onItemPress(item.id)} activeOpacity={0.7}>
              <CustomText style={styles.investButtonText}>出资</CustomText>
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
        <CustomText style={styles.footerText}>{t('common.loading')}</CustomText>
      </View>
    );
  }, [loading, t]);

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('fundraisingChallenge.fundraisingChallenges')}</CustomText>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.contentContainer}>
        {challengeList.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <CustomText style={styles.emptyText}>{t('fundraisingChallenge.noFundraisingChallenges')}</CustomText>
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
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
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
    padding: 10,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  itemTop: {
    width: '100%',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSubRow: {
    flex: 1,
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
    width: 40,
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
