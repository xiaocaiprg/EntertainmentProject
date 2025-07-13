import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../../../../components/CustomText';
import { GameMatchStatisticDto } from '../../../../interface/Game';
import { THEME_COLORS } from '../../../../utils/styles';
import { useTranslation } from '../../../../hooks/useTranslation';

interface StatisticsInfoProps {
  gameMatchStatisticDto: GameMatchStatisticDto;
}

export const StatisticsInfo: React.FC<StatisticsInfoProps> = React.memo((props) => {
  const { gameMatchStatisticDto } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statsItem}>
          <CustomText style={styles.label}>{t('challengeDetail.totalCount')}:</CustomText>
          <CustomText style={styles.value}>{gameMatchStatisticDto.totalCount}</CustomText>
        </View>
        <View style={styles.statsItem}>
          <CustomText style={styles.label}>{t('challengeDetail.totalWinCount')}:</CustomText>
          <CustomText style={styles.valueHighlight}>{gameMatchStatisticDto?.totalWinCount}</CustomText>
        </View>

        <View style={styles.statsItem}>
          <CustomText style={styles.label}>{t('challengeDetail.totalLoseCount')}:</CustomText>
          <CustomText style={styles.valueDanger}>{gameMatchStatisticDto?.totalLoseCount}</CustomText>
        </View>
        <View style={styles.statsItem}>
          <CustomText style={styles.label}>{t('challengeDetail.hitRate')}:</CustomText>
          <CustomText style={styles.valueHighlight}>{gameMatchStatisticDto?.hitRateStr || '-'}</CustomText>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statsItem}>
          <CustomText style={styles.label}>{t('challengeDetail.bankerWinCount')}:</CustomText>
          <CustomText style={styles.valueHighlight}>{gameMatchStatisticDto?.bankerWinCount || 0}</CustomText>
        </View>

        <View style={styles.statsItem}>
          <CustomText style={styles.label}>{t('challengeDetail.bankerLoseCount')}:</CustomText>
          <CustomText style={styles.valueDanger}>{gameMatchStatisticDto?.bankerLoseCount || 0}</CustomText>
        </View>

        <View style={styles.statsItem}>
          <CustomText style={styles.label}>{t('challengeDetail.dealerWinCount')}:</CustomText>
          <CustomText style={styles.valueHighlight}>{gameMatchStatisticDto?.dealerWinCount}</CustomText>
        </View>

        <View style={styles.statsItem}>
          <CustomText style={styles.label}>{t('challengeDetail.dealerLoseCount')}:</CustomText>
          <CustomText style={styles.valueDanger}>{gameMatchStatisticDto?.dealerLoseCount}</CustomText>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginRight: 3,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  valueHighlight: {
    fontSize: 13,
    color: THEME_COLORS.success,
    fontWeight: '500',
  },
  valueDanger: {
    fontSize: 13,
    color: THEME_COLORS.danger,
    fontWeight: '500',
  },
});
