import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME_COLORS } from '../../../utils/styles';
import { RacePoolPageDto } from '../../../interface/Race';

interface PoolInfoCardProps {
  poolDetail: RacePoolPageDto;
}

export const PoolInfoCard: React.FC<PoolInfoCardProps> = React.memo(({ poolDetail }) => {
  return (
    <View style={styles.poolSection}>
      <Text style={styles.poolTitle}>奖金池</Text>
      <View style={styles.poolCard}>
        <View style={styles.poolHeader}>
          <Text style={styles.poolName}>{poolDetail.name}</Text>
          {/* {poolDetail.code && <Text style={styles.poolCode}>编码: {poolDetail.code}</Text>} */}
        </View>

        <View style={styles.poolAmountContainer}>
          <View style={styles.poolAmountItem}>
            <Text style={styles.poolAmountValue}>{poolDetail.totalPoints?.toLocaleString() || '-'}</Text>
            <Text style={styles.poolAmountLabel}>总积分</Text>
          </View>

          <View style={styles.poolAmountDivider} />

          <View style={styles.poolAmountItem}>
            <Text style={[styles.poolAmountValue, styles.availablePoints]}>
              {poolDetail.availablePoints?.toLocaleString() || '-'}
            </Text>
            <Text style={styles.poolAmountLabel}>可用积分</Text>
          </View>

          <View style={styles.poolAmountDivider} />

          <View style={styles.poolAmountItem}>
            <Text style={[styles.poolAmountValue, styles.frozenPoints]}>
              {poolDetail.frozenPoints?.toLocaleString() || '-'}
            </Text>
            <Text style={styles.poolAmountLabel}>冻结积分</Text>
          </View>
        </View>

        {(poolDetail.availablePoints || 0) > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(
                      ((poolDetail.availablePoints || 0) / (poolDetail.totalPoints || 1)) * 100,
                      100,
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.floor(((poolDetail.availablePoints || 0) / (poolDetail.totalPoints || 1)) * 100)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  poolSection: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: THEME_COLORS.border.light,
    marginTop: 10,
  },
  poolTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: THEME_COLORS.text.primary,
    marginBottom: 10,
  },
  poolCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME_COLORS.border.light,
  },
  poolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  poolName: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
    marginBottom: 4,
  },
  poolCode: {
    fontSize: 12,
    color: THEME_COLORS.text.secondary,
  },
  poolAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  poolAmountItem: {
    flex: 1,
    alignItems: 'center',
  },
  poolAmountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLORS.text.primary,
    marginBottom: 4,
  },
  poolAmountLabel: {
    fontSize: 12,
    color: THEME_COLORS.text.secondary,
  },
  poolAmountDivider: {
    height: 30,
    width: 1,
    backgroundColor: THEME_COLORS.border.light,
  },
  frozenPoints: {
    color: '#e74c3c',
  },
  availablePoints: {
    color: THEME_COLORS.success,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME_COLORS.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: THEME_COLORS.text.secondary,
    width: 40,
    textAlign: 'right',
  },
});
