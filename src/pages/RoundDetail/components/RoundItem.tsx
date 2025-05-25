import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '../../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GameRoundDto } from '../../../interface/Game';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import { InningList } from './InningList';

interface RoundItemProps {
  item: GameRoundDto;
  index: number;
  showRestartBtn?: boolean;
  onRestartConfirm: (roundId: number) => void;
  onRefresh: () => void;
}

export const RoundItem: React.FC<RoundItemProps> = React.memo((props) => {
  const { item, index, onRestartConfirm, onRefresh, showRestartBtn } = props;
  const { t } = useTranslation();

  const showRestartButton = index === 0 && showRestartBtn;

  return (
    <View style={styles.roundItem}>
      <View style={styles.roundHeader}>
        <CustomText style={styles.roundTitle}>
          {t('roundDetail.round')} {item.orderNumber}
        </CustomText>
        <CustomText style={styles.createTime}>
          {t('roundDetail.createTime')}: {item.createTime || '-'}
        </CustomText>
      </View>

      <View style={styles.roundContent}>
        <View style={styles.infoRow}>
          <CustomText style={styles.infoLabel}>{t('roundDetail.roundWaterInfo')}:</CustomText>
          <CustomText style={styles.infoValue}>{item.profitStr || '-'}</CustomText>
        </View>

        <View style={styles.infoRow}>
          <CustomText style={styles.infoLabel}>{t('roundDetail.roundTranscoding')}:</CustomText>
          <CustomText style={styles.infoValue}>{item.turnOverStr || '-'}</CustomText>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {showRestartButton && (
          <TouchableOpacity style={styles.restartButton} onPress={() => onRestartConfirm(item.id)}>
            <Icon name="refresh" size={16} color="#fff" style={styles.buttonIcon} />
            <CustomText style={styles.buttonText}>{t('roundDetail.restartRound')}</CustomText>
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
