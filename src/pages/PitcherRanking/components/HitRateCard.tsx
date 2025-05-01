import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import { PlayerHitrateRankDto } from '../../../interface/Ranking';

interface HitRateCardProps {
  item: PlayerHitrateRankDto;
  index: number;
}

export const HitRateCard = React.memo((props: HitRateCardProps) => {
  const { item, index } = props;
  const { t } = useTranslation();
  const rank = index + 1;

  // 获取排名样式
  const getRankStyle = (position: number) => {
    if (position === 1) {
      return styles.rank1;
    }
    if (position === 2) {
      return styles.rank2;
    }
    if (position === 3) {
      return styles.rank3;
    }
    return styles.rankNormal;
  };

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
          <Text style={styles.statValue}>{item.hitRateStr}</Text>
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
});

const styles = StyleSheet.create({
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
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
    width: 100,
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
    justifyContent: 'space-between',
    flex: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME_COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
