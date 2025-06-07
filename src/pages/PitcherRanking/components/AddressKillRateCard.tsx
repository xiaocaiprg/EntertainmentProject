import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../../../components/CustomText';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import { AddressKillrateRankDto } from '../../../interface/Ranking';

interface AddressKillRateCardProps {
  item: AddressKillrateRankDto;
  index: number;
}

export const AddressKillRateCard = React.memo((props: AddressKillRateCardProps) => {
  const { item, index } = props;
  const { t } = useTranslation();
  const rank = index + 1;

  // 获取排名样式
  const getRankStyle = useCallback((position: number) => {
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
  }, []);

  const rankClass = useMemo(() => getRankStyle(rank), [getRankStyle, rank]);

  return (
    <View style={styles.rankItem}>
      <View style={styles.rankItemContent}>
        <View style={[styles.rankBadge, rankClass]}>
          <CustomText style={styles.rankText}>{rank}</CustomText>
        </View>
        <View style={styles.addressInfo}>
          <CustomText style={styles.addressName}>{item.addressInfoName || ''}</CustomText>
        </View>
      </View>
      <View style={[styles.lineContainer, { borderBottomWidth: 1, borderBottomColor: '#EFEFEF', paddingBottom: 10 }]}>
        <View style={styles.statItem}>
          <CustomText style={styles.statValue}>{item.killRateStr}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.killRate')}</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.statValue}>{item.totalProfitStr || '0'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.totalProfit')}</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.statValue}>{item.totalTurnOverStr || '0'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.totalTurnOverStr')}</CustomText>
        </View>
      </View>
      <View style={styles.lineContainer}>
        <View style={styles.statItem}>
          <CustomText style={styles.infoValue}>{item.totalCount || 0}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.totalGames')}</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.infoValue}>{item.winCount || '0'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.winCount')}</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.infoValue}>{item.loseCount || '0'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.loseCount')}</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.infoValue}>{item.hitRateStr || '0'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.hitRate')}</CustomText>
        </View>
      </View>
      <View style={styles.lineContainer}>
        <View style={styles.statItem}>
          <CustomText style={styles.infoValue}>{item.dealerWinCount || '0'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.dealerWinCount')}</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.infoValue}>{item.dealerLoseCount || '0'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.dealerLoseCount')}</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.infoValue}>{item.playerWinCount || '0'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.playerWinCount')}</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.infoValue}>{item.playerLoseCount || '0'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.playerLoseCount')}</CustomText>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  rankItem: {
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  rankItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
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
  addressInfo: {
    width: 100,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: 20,
    paddingTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },

  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME_COLORS.primary,
  },
  infoValue: {
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
