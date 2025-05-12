import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameMatchDto } from '../../../interface/Game';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';

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
      <Text style={styles.detailCardTitle}>{t('fundraisingChallenge.challengeDetails')}</Text>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>{t('fundraisingChallenge.challengeName')}:</Text>
        <Text style={styles.detailValue}>{matchDetail.name || '-'}</Text>
      </View>
      <View style={styles.detailRow}>
        <View style={styles.detailColumn}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('fundraisingChallenge.time')}:</Text>
            <Text style={styles.detailValue}>{matchDetail.gameDate || '-'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('fundraisingChallenge.location')}:</Text>
            <Text style={styles.detailValue}>{matchDetail.addressName || '-'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('fundraisingChallenge.pitcher')}:</Text>
            <Text style={styles.detailValue}>{matchDetail.playPersonName || '-'}</Text>
          </View>
        </View>
        <View style={styles.detailColumnRight}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('fundraisingChallenge.principal')}:</Text>
            <Text style={[styles.detailValue, styles.amountValue]}>{matchDetail.principal || '-'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('fundraisingChallenge.raisedAmount')}:</Text>
            <Text style={[styles.detailValue, styles.amountValue]}>{matchDetail.contributedAmount || '-'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{t('fundraisingChallenge.availableAmount')}:</Text>
            <Text style={[styles.detailValue, styles.availableAmount]}>{matchDetail.availableAmount || '0'}</Text>
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
