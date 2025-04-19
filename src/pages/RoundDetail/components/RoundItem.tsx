import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GameRoundDto } from '../../../interface/Game';
import { ChallengeStatus } from '../../../interface/Common';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import { InningList } from './InningList';

interface RoundItemProps {
  item: GameRoundDto;
  index: number;
  onRestartConfirm: (roundId: number) => void;
  onRefresh: () => void;
}

export const RoundItem: React.FC<RoundItemProps> = React.memo((props) => {
  const { item, index, onRestartConfirm, onRefresh } = props;
  const { t } = useTranslation();

  const showRestartButton = index === 0 && item?.isEnabled === ChallengeStatus.ENDED;

  return (
    <View style={styles.roundItem}>
      <View style={styles.roundHeader}>
        <Text style={styles.roundTitle}>
          {t('roundDetail.round')} {item.orderNumber}
        </Text>
        <Text style={styles.createTime}>
          {t('roundDetail.createTime')}: {item.createTime || '-'}
        </Text>
      </View>

      <View style={styles.roundContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('roundDetail.roundWaterInfo')}:</Text>
          <Text style={styles.infoValue}>{item.profitStr || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('roundDetail.roundTranscoding')}:</Text>
          <Text style={styles.infoValue}>{item.turnOverStr || '-'}</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {showRestartButton && (
          <TouchableOpacity style={styles.restartButton} onPress={() => onRestartConfirm(item.id)}>
            <Icon name="refresh" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{t('roundDetail.restartRound')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {item.gamePointDtoList && item.gamePointDtoList.length > 0 && (
        <InningList pointGroups={item.gamePointDtoList} pointStatus={item.isEnabled} onRefresh={onRefresh} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  roundItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingVertical: 2,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME_COLORS.text.primary,
  },
  createTime: {
    fontSize: 12,
    color: THEME_COLORS.text.light,
  },
  roundContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 14,
    color: THEME_COLORS.text.primary,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  restartButton: {
    backgroundColor: '#4a6fa5',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
