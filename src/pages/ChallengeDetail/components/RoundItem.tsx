import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameRoundDto, GamePointDto } from '../../../interface/Game';
import { PointItem } from './PointItem';
import { useTranslation } from '../../../hooks/useTranslation';

interface RoundItemProps {
  round: GameRoundDto;
  index: number;
}

export const RoundItem = React.memo((props: RoundItemProps) => {
  const { round, index } = props;
  const { t } = useTranslation();

  const renderPoint = useCallback((point: GamePointDto, idx: number) => {
    return <PointItem key={`point-${idx}`} point={point} index={idx} />;
  }, []);

  return (
    <View style={styles.roundItem}>
      <View style={styles.roundHeader}>
        <Text style={styles.roundTitle}>
          {t('challengeDetail.round')} {round.orderNumber || index + 1}
        </Text>
        <View style={styles.itemRow}>
          <Text style={styles.label}>{t('challengeDetail.roundWaterInfo')}:</Text>
          <Text style={styles.value}>{round.profitStr || '-'}</Text>
        </View>
        <View style={styles.itemRow}>
          <Text style={styles.label}>{t('challengeDetail.roundTranscoding')}:</Text>
          <Text style={styles.value}>{round.turnOverStr || '-'}</Text>
        </View>
        <Text style={styles.roundStatus}>
          {round.isEnabled === 1 ? t('challengeDetail.inProgress') : t('challengeDetail.ended')}
        </Text>
      </View>
      {round.gamePointDtoList && round.gamePointDtoList.length > 0 && (
        <>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsTitle}>{t('challengeDetail.detailInfo')}</Text>
            <View style={styles.itemRow}>
              <Text style={styles.label}>{t('challengeDetail.createTime')}:</Text>
              <Text style={styles.value}>{round.createTime || '-'}</Text>
            </View>
          </View>
          {round.gamePointDtoList.map(renderPoint)}
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  roundItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 6,
  },
  roundTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  roundStatus: {
    fontSize: 13,
    color: '#4caf50',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: '#666',
  },
  value: {
    fontSize: 13,
    color: '#333',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 8,
    color: '#333',
  },
});
