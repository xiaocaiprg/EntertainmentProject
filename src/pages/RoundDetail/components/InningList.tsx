import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GameInningDto, GamePointDto } from '../../../interface/Game';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import { updateInning } from '../../../api/services/inningService';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { validateBetAmount } from '../utils/validation';

interface InningListProps {
  pointGroups: GamePointDto[];
  pointStatus: number;
  onRefresh: () => void;
}

export const InningList: React.FC<InningListProps> = React.memo((props) => {
  const { pointGroups, pointStatus, onRefresh } = props;
  const { t } = useTranslation();
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [selectedInning, setSelectedInning] = useState<GameInningDto | null>(null);
  const [newBetAmount, setNewBetAmount] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const hasPointsData = useMemo(() => pointGroups && pointGroups.length > 0, [pointGroups]);

  // 处理组展开收起
  const toggleGroup = useCallback((eventNum: number) => {
    setExpandedGroups((prev) => {
      if (prev.includes(eventNum)) {
        return prev.filter((num) => num !== eventNum);
      } else {
        return [...prev, eventNum];
      }
    });
  }, []);

  // 检查组是否已展开
  const isGroupExpanded = useCallback((eventNum: number) => expandedGroups.includes(eventNum), [expandedGroups]);

  // 打开修改押注确认框
  const showModifyConfirm = useCallback((inning: GameInningDto) => {
    setSelectedInning(inning);
    setConfirmModalVisible(true);
  }, []);

  // 关闭确认框
  const handleCancelModify = useCallback(() => {
    setConfirmModalVisible(false);
    setSelectedInning(null);
    setNewBetAmount('');
  }, []);

  // 确认修改押注金额
  const handleConfirmModify = useCallback(async () => {
    if (!selectedInning) {
      return;
    }
    const result = validateBetAmount(newBetAmount);
    if (!result.valid) {
      // 显示对应的错误提示
      Alert.alert(t('common.error'), t(result.errorKey || 'common.error'), [{ text: t('common.ok') }]);
      return;
    }
    setProcessing(true);
    try {
      await updateInning({
        id: selectedInning.id,
        betNumber: result.value,
      });
      setConfirmModalVisible(false);
      onRefresh(); // 刷新数据
      Alert.alert(t('common.confirm'), t('roundDetail.modifySuccess'), [{ text: t('common.ok') }]);
    } catch (error) {
      setConfirmModalVisible(false);
      const errorMessage = error instanceof Error ? error.message : t('roundDetail.modifyFailed');
      Alert.alert(t('common.error'), errorMessage, [{ text: t('common.ok') }]);
    }
    setProcessing(false);
  }, [selectedInning, newBetAmount, t, onRefresh]);

  const renderInning = useCallback(
    (inning: GameInningDto, idx: number) => {
      return (
        <View key={`inning-${inning.id || idx}`} style={styles.inningItem}>
          <Text
            style={[
              styles.inningResult,
              inning.result === 1 ? styles.winText : inning.result === 2 ? styles.loseText : {},
            ]}
          >
            {inning.result === 1 ? '+' : inning.result === 2 ? '-' : ''}
          </Text>
          <Text style={styles.inningLabel}>{`(${inning.isDealer === 1 ? '庄' : '闲'})`}</Text>
          <Text style={styles.inningBet}>{inning.betNumber}</Text>
          <TouchableOpacity style={styles.modifyButton} onPress={() => showModifyConfirm(inning)}>
            <Icon name="edit" size={14} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{t('roundDetail.modifyBet')}</Text>
          </TouchableOpacity>
        </View>
      );
    },
    [showModifyConfirm, t],
  );

  const renderPointGroup = useCallback(
    (item: GamePointDto) => {
      const isExpanded = isGroupExpanded(item.eventNum);
      return (
        <View key={`group_${item.eventNum}`} style={styles.groupContainer}>
          <TouchableOpacity style={styles.groupHeader} onPress={() => toggleGroup(item.eventNum)}>
            <View style={styles.groupTitleRow}>
              <Text style={styles.groupTitle}>
                {t('roundDetail.eventNumber')}: {item.eventNum}
              </Text>
              <Text style={styles.groupBetNumber}>
                {t('roundDetail.betAmount')}: {item.betNumber}
              </Text>
              <Text style={styles.groupBetNumber}>
                {t('roundDetail.status')}: {pointStatus === 1 ? '进行中' : '已结束'}
              </Text>
            </View>
            <Icon name={isExpanded ? 'expand-less' : 'expand-more'} size={24} color={THEME_COLORS.text.primary} />
          </TouchableOpacity>
          {isExpanded && item.gameInningDtoList && item.gameInningDtoList.length > 0 && (
            <View style={styles.inningContainer}>
              {item.gameInningDtoList.map((inningItem, idx) => renderInning(inningItem, idx))}
            </View>
          )}
        </View>
      );
    },
    [t, isGroupExpanded, toggleGroup, renderInning, pointStatus],
  );

  if (!hasPointsData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('common.noData')}</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.groupsContainer}>{pointGroups.map((group) => renderPointGroup(group))}</View>
      <ConfirmModal
        visible={confirmModalVisible}
        title={t('roundDetail.modifyBetTitle')}
        message={`${t('roundDetail.modifyBetConfirmation')} ${newBetAmount}`}
        onCancel={handleCancelModify}
        onConfirm={handleConfirmModify}
        isProcessing={processing}
        customContent={
          <TextInput
            style={styles.betInput}
            value={newBetAmount}
            onChangeText={setNewBetAmount}
            keyboardType="numeric"
            placeholder={t('roundDetail.modifyBetPlaceholder')}
            placeholderTextColor={THEME_COLORS.text.light}
          />
        }
      />
    </>
  );
});

const styles = StyleSheet.create({
  groupsContainer: {
    marginTop: 5,
  },
  emptyContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: THEME_COLORS.text.light,
  },
  groupContainer: {
    marginBottom: 5,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#f5f5f5',
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  groupBetNumber: {
    marginLeft: 10,
    fontSize: 10,
    color: THEME_COLORS.text.secondary,
  },
  inningContainer: {
    padding: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    borderRadius: 4,
    padding: 4,
    marginRight: 4,
    marginBottom: 4,
    borderWidth: 0.5,
    borderColor: '#eaeaea',
  },
  inningResult: {
    fontSize: 15,
    fontWeight: '700',
  },
  inningLabel: {
    fontSize: 12,
    color: '#555',
  },
  inningBet: {
    fontSize: 12,
    color: THEME_COLORS.text.secondary,
    marginLeft: 4,
  },
  winText: {
    color: '#4caf50',
  },
  loseText: {
    color: '#f44336',
  },
  modifyButton: {
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginLeft: 4,
  },
  buttonIcon: {
    marginRight: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  betInput: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: THEME_COLORS.text.primary,
  },
});

export default InningList;
