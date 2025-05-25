import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RacePoolPageDto, RacePoolStatus } from '../../../interface/Race';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomText from '../../../components/CustomText';
import ConfirmModal from '../../../components/ConfirmModal';
import { updateRacePoolStatus } from '../../../api/services/raceService';

interface PoolCardProps {
  pool: RacePoolPageDto;
  color: string;
  isAdmin: boolean;
  onPress?: (pool: RacePoolPageDto) => void;
  onDistribute?: (pool: RacePoolPageDto) => void;
  onStatusChange?: (pool?: RacePoolPageDto) => void;
}

export const PoolCard = React.memo((props: PoolCardProps) => {
  const { pool, color, isAdmin, onPress, onDistribute, onStatusChange } = props;
  const { t } = useTranslation();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePress = useCallback(() => {
    onPress && onPress(pool);
  }, [onPress, pool]);

  const handleDistribute = useCallback(() => {
    if (onDistribute && pool.availablePoints && pool.availablePoints > 0) {
      onDistribute(pool);
    }
  }, [onDistribute, pool]);

  const handleToggleStatus = useCallback(() => {
    if (!pool.id) {
      return;
    }
    setShowConfirmModal(true);
  }, [pool.id]);

  const handleConfirmToggle = useCallback(async () => {
    if (!pool.id) {
      return;
    }
    setIsProcessing(true);
    try {
      const newStatus = pool.isEnabled === RacePoolStatus.ENABLED ? RacePoolStatus.DISABLED : RacePoolStatus.ENABLED;
      await updateRacePoolStatus({ id: pool.id, isEnabled: newStatus });
      onStatusChange && onStatusChange(pool);
      setShowConfirmModal(false);
    } catch (error: any) {
      Alert.alert(error.message);
    }
    setIsProcessing(false);
  }, [pool, onStatusChange]);

  const handleCancelToggle = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const isActive = pool.availablePoints && pool.availablePoints > 0;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: `${color}10` }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <CustomText style={[styles.title, { color }]} numberOfLines={1}>
          {pool.name}
        </CustomText>
      </View>

      <View style={[styles.amountSection, { backgroundColor: `${color}10` }]}>
        <CustomText style={styles.amountLabel}>{t('racePoolList.amount')}</CustomText>
        <CustomText style={[styles.amountValue, { color }]}>{pool.totalPoints || 0}</CustomText>
      </View>
      <View style={styles.footerSection}>
        {isAdmin && (
          <View style={styles.adminButtonsContainer}>
            <TouchableOpacity
              style={[styles.statusButton, pool.isEnabled === 1 ? styles.enabledButton : styles.disabledStatusButton]}
              onPress={handleToggleStatus}
            >
              <CustomText style={styles.statusButtonText}>
                {pool.isEnabled === RacePoolStatus.ENABLED ? t('racePoolList.inactive') : t('racePoolList.active')}
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.distributeButton, !isActive && styles.disabledButton]}
              onPress={handleDistribute}
              disabled={!isActive}
            >
              <CustomText style={styles.distributeButtonText}>{t('racePoolList.distributePoints')}</CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ConfirmModal
        visible={showConfirmModal}
        title={`确认${pool.isEnabled === RacePoolStatus.ENABLED ? '关闭' : '开启'}`}
        message={`确定要${pool.isEnabled === RacePoolStatus.ENABLED ? '关闭' : '开启'}${pool.name || '此奖金池'}吗？`}
        onCancel={handleCancelToggle}
        onConfirm={handleConfirmToggle}
        isProcessing={isProcessing}
      />
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
    justifyContent: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  raceNameContainer: {
    flex: 1,
    marginRight: 10,
  },
  adminButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
  },
  enabledButton: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  disabledStatusButton: {
    backgroundColor: '#27ae60',
    borderColor: '#27ae60',
  },
  statusButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
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
