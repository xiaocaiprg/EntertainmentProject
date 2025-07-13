import React from 'react';
import { View, StyleSheet } from 'react-native';
import { THEME_COLORS } from '../../../../utils/styles';
import { RacePoolPageDto, RacePoolStatus } from '../../../../interface/Race';
import { useTranslation } from '../../../../hooks/useTranslation';
import CustomText from '../../../../components/CustomText';

interface PoolInfoCardProps {
  poolDetail: RacePoolPageDto;
}

export const PoolInfoCard: React.FC<PoolInfoCardProps> = React.memo(({ poolDetail }) => {
  const { t } = useTranslation();

  const isEnabled = poolDetail.isEnabled === RacePoolStatus.ENABLED;
  const statusText = isEnabled ? t('racePoolList.active') : t('racePoolList.inactive');
  const statusColor = isEnabled ? THEME_COLORS.success : THEME_COLORS.danger;

  return (
    <View style={styles.poolCard}>
      <CustomText style={styles.poolTitle}>{t('raceDetail.pool')}</CustomText>
      <CustomText style={[styles.poolAmountValue, styles.availablePoints]}>
        {poolDetail.availablePoints?.toLocaleString() || '-'}
      </CustomText>
      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <CustomText style={styles.statusText}>{statusText}</CustomText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  poolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    marginBottom: 8,
    borderColor: THEME_COLORS.border.light,
  },
  poolTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: THEME_COLORS.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },

  poolAmountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLORS.text.primary,
  },
  availablePoints: {
    color: THEME_COLORS.success,
  },
});
