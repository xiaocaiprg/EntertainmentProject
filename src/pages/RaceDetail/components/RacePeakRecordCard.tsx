import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GameMatchSimpleDto } from '../../../interface/Ranking';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomText from '../../../components/CustomText';

interface RacePeakRecordCardProps {
  matchData: GameMatchSimpleDto;
  recordType: 'profit' | 'count';
}

export const RacePeakRecordCard: React.FC<RacePeakRecordCardProps> = React.memo((props) => {
  const { matchData, recordType } = props;
  const { t } = useTranslation();

  if (!matchData) {
    return null;
  }

  const gradientColors = recordType === 'profit' ? ['#4776E6', '#8E54E9'] : ['#2193b0', '#6dd5ed'];

  const cardTitle = recordType === 'profit' ? '最大上下水' : '最多把数';
  const cardValue = recordType === 'profit' ? matchData.profitStr : String(matchData.count);

  return (
    <View style={styles.cardOuterContainer}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cardGradient}>
        <View style={styles.cardHeader}>
          <CustomText style={styles.cardTitle}>{cardTitle}</CustomText>
          <CustomText style={styles.cardValue}>{cardValue}</CustomText>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <CustomText style={styles.infoLabel}>{t('peakRecord.gameName')}:</CustomText>
            <CustomText style={styles.infoValue} numberOfLines={1}>
              {matchData.name || '--'}
            </CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText style={styles.infoLabel}>{t('peakRecord.gameDate')}:</CustomText>
            <CustomText style={styles.infoValue}>{matchData.gameDate || '--'}</CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText style={styles.infoLabel}>{t('peakRecord.location')}:</CustomText>
            <CustomText style={styles.infoValue} numberOfLines={1}>
              {matchData.addressName || '--'}
            </CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText style={styles.infoLabel}>{t('peakRecord.playRule')}:</CustomText>
            <CustomText style={styles.infoValue}>{matchData.playRuleName || '--'}</CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText style={styles.infoLabel}>{t('peakRecord.pitcher')}:</CustomText>
            <CustomText style={styles.infoValue}>{matchData.playPersonName || '--'}</CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText style={styles.infoLabel}>{t('peakRecord.turnOver')}:</CustomText>
            <CustomText style={styles.infoValue}>{matchData.turnOverStr || '--'}</CustomText>
          </View>
          <View style={styles.infoRow}>
            <CustomText style={styles.infoLabel}>{t('peakRecord.currency')}:</CustomText>
            <CustomText style={styles.infoValue}>{matchData.currency || '--'}</CustomText>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  cardOuterContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 5,
  },
  cardGradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '100%',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  cardContent: {
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#fff',
    width: 60,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12,
    color: '#fff',
    flex: 1,
    fontWeight: '500',
  },
});
