import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GameMatchDto } from '../../../../interface/Game';
import { THEME_COLORS } from '../../../../utils/styles';
import { useTranslation } from '../../../../hooks/useTranslation';
import CustomText from '../../../../components/CustomText';
interface ChallengeDetailCardProps {
  matchDetail: GameMatchDto | null;
}

export const ChallengeDetailCard: React.FC<ChallengeDetailCardProps> = React.memo((props) => {
  const { matchDetail } = props;
  const { t } = useTranslation();

  if (!matchDetail) {
    return null;
  }

  return (
    <View style={styles.detailCard}>
      <CustomText style={styles.detailCardTitle}>{t('fundraisingChallenge.challengeDetails')}</CustomText>
      <View style={styles.detailItem}>
        <CustomText style={styles.detailLabel}>{t('fundraisingChallenge.challengeName')}:</CustomText>
        <CustomText style={styles.detailValue}>{matchDetail.name || '-'}</CustomText>
      </View>
      <View style={styles.detailRow}>
        <View style={styles.detailColumn}>
          <View style={styles.detailItem}>
            <CustomText style={styles.detailLabel}>{t('fundraisingChallenge.time')}:</CustomText>
            <CustomText style={styles.detailValue}>{matchDetail.gameDate || '-'}</CustomText>
          </View>
          <View style={styles.detailItem}>
            <CustomText style={styles.detailLabel}>{t('fundraisingChallenge.location')}:</CustomText>
            <CustomText style={styles.detailValue}>{matchDetail.addressName || '-'}</CustomText>
          </View>
          <View style={styles.detailItem}>
            <CustomText style={styles.detailLabel}>{t('fundraisingChallenge.pitcher')}:</CustomText>
            <CustomText style={styles.detailValue}>{matchDetail.playPersonName || '-'}</CustomText>
          </View>
        </View>
        <View style={styles.detailColumnRight}>
          <View style={styles.detailItem}>
            <CustomText style={styles.longLabel}>{t('fundraisingChallenge.principal')}:</CustomText>
            <CustomText style={[styles.detailValue, styles.amountValue]}>{matchDetail.principal || '-'}</CustomText>
          </View>
          <View style={styles.detailItem}>
            <CustomText style={styles.longLabel}>{t('fundraisingChallenge.raisedAmount')}:</CustomText>
            <CustomText style={[styles.detailValue, styles.amountValue]}>
              {matchDetail.contributedAmount || '-'}
            </CustomText>
          </View>
          <View style={styles.detailItem}>
            <CustomText style={styles.longLabel}>{t('fundraisingChallenge.availableAmount')}:</CustomText>
            <CustomText style={[styles.detailValue, styles.availableAmount]}>
              {matchDetail.availableAmount || '0'}
            </CustomText>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 10,
  },
  detailCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailColumn: {
    flex: 1,
  },
  detailColumnRight: {
    flex: 1,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    width: 50,
  },
  longLabel: {
    fontSize: 14,
    color: '#999',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  amountValue: {
    fontWeight: '600',
  },
  availableAmount: {
    color: THEME_COLORS.success,
    fontWeight: '500',
  },
});
