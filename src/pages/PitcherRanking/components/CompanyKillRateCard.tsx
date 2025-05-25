import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { THEME_COLORS } from '../../../utils/styles';
import CustomText from '../../../components/CustomText';
import { useTranslation } from '../../../hooks/useTranslation';
import { PlayerCompanyKillrateRankDto } from '../../../interface/Ranking';

interface CompanyKillRateCardProps {
  item: PlayerCompanyKillrateRankDto;
  index: number;
}

export const CompanyKillRateCard = React.memo((props: CompanyKillRateCardProps) => {
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
      <View style={[styles.rankBadge, rankClass]}>
        <CustomText style={styles.rankText}>{rank}</CustomText>
      </View>
      <View style={styles.companyInfo}>
        <CustomText style={styles.companyName}>{item.companyName || ''}</CustomText>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <CustomText style={styles.statValue}>{item.killRateStr || '-'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.killRate')}</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.statValue}>{item.totalProfitStr || '-'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.totalProfit')}</CustomText>
        </View>
        <View style={styles.statItem}>
          <CustomText style={styles.statValue}>{item.totalTurnOverStr || '-'}</CustomText>
          <CustomText style={styles.statLabel}>{t('pitcher_ranking.totalTurnOver')}</CustomText>
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
  companyInfo: {
    width: 80,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
