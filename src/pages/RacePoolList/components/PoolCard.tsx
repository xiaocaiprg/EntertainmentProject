import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RacePoolPageDto } from '../../../interface/Race';
import { useTranslation } from '../../../hooks/useTranslation';

interface PoolCardProps {
  pool: RacePoolPageDto;
  color: string;
  isAdmin: boolean;
  onPress?: (pool: RacePoolPageDto) => void;
  onDistribute?: (pool: RacePoolPageDto) => void;
}

export const PoolCard = React.memo((props: PoolCardProps) => {
  const { pool, color, isAdmin, onPress, onDistribute } = props;
  const { t } = useTranslation();

  const handlePress = useCallback(() => {
    onPress && onPress(pool);
  }, [onPress, pool]);

  const handleDistribute = useCallback(() => {
    if (onDistribute && pool.availablePoints && pool.availablePoints > 0) {
      onDistribute(pool);
    }
  }, [onDistribute, pool]);

  const isActive = pool.availablePoints && pool.availablePoints > 0;
  const statusText = isActive ? t('racePoolList.active') : t('racePoolList.inactive');
  const statusColor = isActive ? '#27ae60' : '#e74c3c';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: `${color}10` }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color }]} numberOfLines={1}>
          {pool.name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      <View style={[styles.amountSection, { backgroundColor: `${color}10` }]}>
        <Text style={styles.amountLabel}>{t('racePoolList.amount')}</Text>
        <Text style={[styles.amountValue, { color }]}>{pool.totalPoints || 0}</Text>
      </View>
      <View style={styles.footerSection}>
        <View style={styles.raceNameContainer}>
          <Text style={styles.raceName}>{t('racePoolList.raceName')}</Text>
          <Text style={[styles.raceNameValue, { color }]} numberOfLines={1}>
            {pool.raceName || '-'}
          </Text>
        </View>
        {isAdmin && (
          <TouchableOpacity
            style={[styles.distributeButton, !isActive && styles.disabledButton]}
            onPress={handleDistribute}
            disabled={!isActive}
          >
            <Text style={styles.distributeButtonText}>{t('racePoolList.distributePoints')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginBottom: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
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
  amountSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  raceName: {
    fontSize: 12,
    color: '#666',
  },
  raceNameValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  raceNameContainer: {
    flex: 1,
    marginRight: 10,
  },
  distributeButton: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  distributeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
