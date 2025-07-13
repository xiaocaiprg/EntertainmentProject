import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { GameMatchPageDto } from '../../../../interface/Game';
import { THEME_COLORS } from '../../../../utils/styles';
import { getStatusText } from '../../../../public/Game';
import { useTranslation } from '../../../../hooks/useTranslation';
import CustomText from '../../../../components/CustomText';

interface ChallengeCardProps {
  item: GameMatchPageDto;
  onEditPress: (challengeId: number | undefined) => void;
}

export const ChallengeCard = React.memo((props: ChallengeCardProps) => {
  const { item, onEditPress } = props;
  const { t } = useTranslation();

  const handleEditPress = useCallback(() => {
    onEditPress(item.id);
  }, [item.id, onEditPress]);

  const statusInfo = getStatusText(item.isEnabled);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <CustomText style={styles.challengeName}>{item.name || '-'}</CustomText>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
          <CustomText style={styles.statusText}>{statusInfo.text}</CustomText>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <CustomText style={styles.label}>{t('challengeDetail.time')}:</CustomText>
          <CustomText style={styles.value}>{item.gameDate}</CustomText>
        </View>

        <View style={styles.infoRow}>
          <CustomText style={styles.label}>{t('challengeDetail.location')}:</CustomText>
          <CustomText style={styles.value}>{item.addressName || '-'}</CustomText>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <CustomText style={styles.label}>{t('challengeDetail.pitcher')}:</CustomText>
          <CustomText style={styles.value}>{item.playPersonName || '-'}</CustomText>
        </View>
        <View style={styles.infoRow}>
          <CustomText style={styles.label}>{t('challengeDetail.playRule')}:</CustomText>
          <CustomText style={styles.value}>{item.playRuleName}</CustomText>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <CustomText style={styles.label}>{t('challengeDetail.principal')}:</CustomText>
          <CustomText style={styles.value}>{item.principal}</CustomText>
        </View>
        <View style={styles.infoRow}>
          <CustomText style={styles.label}>{t('challengeDetail.currency')}:</CustomText>
          <CustomText style={styles.value}>{item.currency}</CustomText>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
        <CustomText style={styles.editButtonText}>{t('assignPitcher.selectPitcher')}</CustomText>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    flex: 1,
  },

  label: {
    fontSize: 14,
    color: '#666',
    width: 50,
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  editButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
