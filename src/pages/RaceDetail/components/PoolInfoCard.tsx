import React from 'react';
import { View, StyleSheet } from 'react-native';
import { THEME_COLORS } from '../../../utils/styles';
import { RacePoolPageDto } from '../../../interface/Race';
import CustomText from '../../../components/CustomText';

interface PoolInfoCardProps {
  poolDetail: RacePoolPageDto;
}

export const PoolInfoCard: React.FC<PoolInfoCardProps> = React.memo(({ poolDetail }) => {
  return (
    <View style={styles.poolCard}>
      <CustomText style={styles.poolTitle}>奖金池</CustomText>
      <View style={styles.poolAmountItem}>
        <CustomText style={styles.poolAmountLabel}>可用积分:</CustomText>
        <CustomText style={[styles.poolAmountValue, styles.availablePoints]}>
          {poolDetail.availablePoints?.toLocaleString() || '-'}
        </CustomText>
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
    borderColor: THEME_COLORS.border.light,
  },
  poolTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: THEME_COLORS.text.primary,
  },
  poolAmountItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  poolAmountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLORS.text.primary,
  },
  poolAmountLabel: {
    fontSize: 12,
    color: THEME_COLORS.text.secondary,
  },
  availablePoints: {
    color: THEME_COLORS.success,
  },
});
