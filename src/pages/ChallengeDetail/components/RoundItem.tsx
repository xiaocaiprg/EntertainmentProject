import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { GameRoundDto, GamePointDto } from '../../../interface/Game';
import { PointItem } from './PointItem';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomText from '../../../components/CustomText';

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

  const faultData = useMemo(() => round.faultGameInningDtoList || [], [round.faultGameInningDtoList]);

  return (
    <View style={styles.roundItem}>
      <View style={styles.roundHeader}>
        <CustomText style={styles.roundTitle}>
          {t('challengeDetail.round')} {round.orderNumber || index + 1}
        </CustomText>
        <View style={styles.itemRow}>
          <CustomText style={styles.label}>{t('challengeDetail.roundWaterInfo')}:</CustomText>
          <CustomText style={styles.value}>{round.profitStr || '-'}</CustomText>
        </View>
        <View style={styles.itemRow}>
          <CustomText style={styles.label}>{t('challengeDetail.roundTranscoding')}:</CustomText>
          <CustomText style={styles.value}>{round.turnOverStr || '-'}</CustomText>
        </View>
        <CustomText style={styles.roundStatus}>
          {round.isEnabled === 1 ? t('challengeDetail.inProgress') : t('challengeDetail.ended')}
        </CustomText>
      </View>

      {faultData.length > 0 && (
        <View style={styles.faultContainer}>
          <CustomText style={styles.faultTitle}>{t('challengeDetail.faultBetData')}</CustomText>
          <View style={styles.faultItemsContainer}>
            {faultData.map((item, idx) => (
              <CustomText style={styles.faultText} key={`fault-${item.id || idx}`}>
                {`第${item.eventNum}轮-第${item.orderNumber}把实际押注:  ${item.betNumber}`}
              </CustomText>
            ))}
          </View>
        </View>
      )}

      {round.gamePointDtoList && round.gamePointDtoList.length > 0 && (
        <>
          <View style={styles.pointsContainer}>
            <CustomText style={styles.pointsTitle}>{t('challengeDetail.detailInfo')}</CustomText>
            <View style={styles.itemRow}>
              <CustomText style={styles.label}>{t('challengeDetail.createTime')}:</CustomText>
              <CustomText style={styles.value}>{round.createTime || '-'}</CustomText>
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
    alignItems: 'center',
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
    marginVertical: 2,
  },
  label: {
    fontSize: 15,
    color: '#666',
    marginRight: 5,
  },
  value: {
    fontSize: 15,
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
    marginVertical: 4,
    color: '#333',
  },
  faultContainer: {
    marginVertical: 5,
  },
  faultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4B00',
  },
  faultItemsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 2,
  },
  faultText: {
    fontSize: 13,
    color: '#555',
  },
});
