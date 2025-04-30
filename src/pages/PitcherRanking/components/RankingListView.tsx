import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import { RankingTabType, PlayerHitrateRankDto, PlayerKillrateRankDto } from '../../../interface/Ranking';

interface RankingListViewProps {
  loading: boolean;
  currentTab: RankingTabType;
  hitRateData: PlayerHitrateRankDto[];
  killRateData: PlayerKillrateRankDto[];
}

export const RankingListView = React.memo((props: RankingListViewProps) => {
  const { loading, currentTab, hitRateData, killRateData } = props;
  const { t } = useTranslation();

  // 获取排名样式
  const getRankStyle = useCallback((rank: number) => {
    if (rank === 1) {
      return styles.rank1;
    }
    if (rank === 2) {
      return styles.rank2;
    }
    if (rank === 3) {
      return styles.rank3;
    }
    return styles.rankNormal;
  }, []);

  // 渲染命中率卡片
  const renderHitRateCard = useCallback(
    (item: PlayerHitrateRankDto, index: number) => {
      const rank = index + 1;
      const rankClass = getRankStyle(rank);

      return (
        <View style={styles.rankItem}>
          <View style={[styles.rankBadge, rankClass]}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{item.playerName || ''}</Text>
            <Text style={styles.companyName}>{item.companyName || ''}</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {item.hitRateStr || (item.hitRate ? `${(item.hitRate * 100).toFixed(1)}%` : '0%')}
              </Text>
              <Text style={styles.statLabel}>{t('pitcher_ranking.hitRate')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.totalInningCount || 0}</Text>
              <Text style={styles.statLabel}>{t('pitcher_ranking.totalGames')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.winInningCount || 0}</Text>
              <Text style={styles.statLabel}>{t('pitcher_ranking.winCount')}</Text>
            </View>
          </View>
        </View>
      );
    },
    [getRankStyle, t],
  );

  // 渲染杀数卡片
  const renderKillCountCard = useCallback(
    (item: PlayerKillrateRankDto, index: number) => {
      const rank = index + 1;
      const rankClass = getRankStyle(rank);

      return (
        <View style={styles.rankItem}>
          <View style={[styles.rankBadge, rankClass]}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{item.playerName || ''}</Text>
            <Text style={styles.companyName}>{item.companyName || ''}</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.winInningCount || '-'}</Text>
              <Text style={styles.statLabel}>{t('pitcher_ranking.killCount')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{item.totalInningCount || '-'}</Text>
              <Text style={styles.statLabel}>{t('pitcher_ranking.totalGames')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, styles.profitValue]}>{item.totalProfitStr || '-'}</Text>
              <Text style={styles.statLabel}>{t('pitcher_ranking.totalProfit')}</Text>
            </View>
          </View>
        </View>
      );
    },
    [getRankStyle, t],
  );

  // 获取当前数据
  const currentData = useMemo(() => {
    return currentTab === RankingTabType.HIT_RATE ? hitRateData : killRateData;
  }, [currentTab, hitRateData, killRateData]);

  // 渲染空数据状态
  const renderEmpty = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text style={styles.emptyText}>{t('common.loading')}</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Icon name="error-outline" size={50} color="#ccc" />
        <Text style={styles.emptyText}>{t('pitcher_ranking.noData')}</Text>
      </View>
    );
  }, [loading, t]);
  if (currentData.length === 0 || loading) {
    return renderEmpty;
  }
  return (
    <View style={styles.container}>
      {currentTab === RankingTabType.HIT_RATE
        ? hitRateData.map((item, index) => (
            <React.Fragment key={`${item.playerCode}-${index}`}>{renderHitRateCard(item, index)}</React.Fragment>
          ))
        : killRateData.map((item, index) => (
            <React.Fragment key={`${item.playerCode}-${index}`}>{renderKillCountCard(item, index)}</React.Fragment>
          ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rank1: {
    backgroundColor: '#FFD700',
  },
  rank2: {
    backgroundColor: '#C0C0C0',
  },
  rank3: {
    backgroundColor: '#CD7F32',
  },
  rankNormal: {
    backgroundColor: '#EFEFEF',
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  playerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  companyName: {
    fontSize: 12,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    alignItems: 'center',
    marginLeft: 15,
    minWidth: 60,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME_COLORS.primary,
  },
  profitValue: {
    fontSize: 14,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
  },
});

export default RankingListView;
