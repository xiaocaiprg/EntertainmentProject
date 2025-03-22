import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import DropdownSelect from './DropdownSelect';
import { THEME_COLORS } from '../../../utils/styles';
import { GameMatchDto, GameRoundDto } from '../../../interface/Game';
import { getRoundList } from '../../../api/services/gameService';

interface ExistingChallengeFormProps {
  challenges: GameMatchDto[];
  selectedChallengeId: number;
  onSelectChallengeId: (id: number) => void;
  onConfirm: () => void;
  setActiveRoundId: (id: number) => void;
}

export const ExistingChallengeForm: React.FC<ExistingChallengeFormProps> = React.memo(
  (props: ExistingChallengeFormProps) => {
    const { challenges, selectedChallengeId, onSelectChallengeId, onConfirm, setActiveRoundId } = props;

    const [rounds, setRounds] = useState<GameRoundDto[]>([]); // 场次列表
    const [loading, setLoading] = useState(false);
    const [hasActiveRound, setHasActiveRound] = useState(false); // 是否存在进行中的场次

    const fetchRounds = useCallback(
      async (matchId: number) => {
        if (matchId <= 0) {
          return;
        }
        setLoading(true);
        const roundsData = await getRoundList(matchId);
        if (roundsData && roundsData.length > 0) {
          setRounds(roundsData);
          // 检查是否有进行中的场次（isEnabled=1）
          const activeRound = roundsData.find((round) => round.isEnabled === 1);
          setHasActiveRound(!!activeRound);
          // 如果有进行中的场次，记录其ID
          if (activeRound) {
            setActiveRoundId(activeRound?.id || 0);
          } else {
            setActiveRoundId(0);
          }
        } else {
          setRounds([]);
          setHasActiveRound(false);
          setActiveRoundId(0);
        }
        setLoading(false);
      },
      [setActiveRoundId],
    );

    // 当挑战ID变化时，获取对应的场次数据
    useEffect(() => {
      if (selectedChallengeId > 0) {
        fetchRounds(selectedChallengeId);
      } else {
        setRounds([]);
        setHasActiveRound(false);
        setActiveRoundId(0);
      }
    }, [selectedChallengeId, fetchRounds, setActiveRoundId]);

    // 确认按钮是否禁用
    const isConfirmDisabled = useMemo(() => {
      return selectedChallengeId <= 0 || loading;
    }, [selectedChallengeId, loading]);

    // 获取挑战的状态描述
    const getChallengeStatus = useMemo(() => {
      if (loading) {
        return '加载中...';
      }

      if (selectedChallengeId <= 0) {
        return '请选择挑战';
      }

      if (rounds.length === 0) {
        return '该挑战暂无场次记录';
      }

      if (hasActiveRound) {
        return '该挑战有进行中的场次';
      } else {
        return '该挑战的所有场次已结束';
      }
    }, [loading, selectedChallengeId, rounds.length, hasActiveRound]);

    // 对场次数据进行排序处理
    const sortedRounds = useMemo(() => {
      return [...rounds].sort((a, b) => {
        // 先按照状态排序：进行中的在前
        if (a.isEnabled !== b.isEnabled) {
          return b.isEnabled - a.isEnabled;
        }
        // 同状态按orderNumber排序
        return (a.orderNumber || 0) - (b.orderNumber || 0);
      });
    }, [rounds]);

    // 渲染场次列表
    const renderRoundsList = useCallback(() => {
      if (loading) {
        return <Text style={styles.loadingText}>加载中...</Text>;
      }

      if (sortedRounds.length === 0) {
        return <Text style={styles.emptyText}>暂无场次记录</Text>;
      }

      return (
        <ScrollView style={styles.roundsList}>
          {sortedRounds.map((round) => {
            const isActive = round.isEnabled === 1;
            return (
              <View style={styles.roundItem} key={round.id}>
                <View style={styles.roundInfo}>
                  <Text style={styles.roundName}>{`场次${round.orderNumber || ''}`}</Text>
                  <View style={[styles.statusBadge, isActive ? styles.activeBadge : styles.inactiveBadge]}>
                    <Text style={[styles.statusBadgeText, isActive ? styles.activeText : styles.inactiveText]}>
                      {isActive ? '进行中' : '已结束'}
                    </Text>
                  </View>
                </View>
                {round.playPersonName && <Text style={styles.roundDetail}>玩家: {round.playPersonName}</Text>}
                {round.address && <Text style={styles.roundDetail}>地址: {round.address}</Text>}
              </View>
            );
          })}
        </ScrollView>
      );
    }, [loading, sortedRounds]);

    return (
      <View style={styles.formContainer}>
        <DropdownSelect
          title="选择挑战"
          options={challenges}
          selectedValue={selectedChallengeId}
          placeholder="请选择挑战"
          onSelect={onSelectChallengeId}
          valueKey="id"
          labelKey="name"
        />
        {selectedChallengeId > 0 && <Text style={styles.statusText}>场次状态: {getChallengeStatus}</Text>}

        {selectedChallengeId > 0 && (
          <View style={styles.roundsContainer}>
            <Text style={styles.roundsTitle}>场次列表</Text>
            {renderRoundsList()}
          </View>
        )}

        <View style={styles.spacer} />

        <TouchableOpacity
          style={[styles.confirmButton, isConfirmDisabled && styles.confirmButtonDisabled]}
          onPress={onConfirm}
          disabled={isConfirmDisabled}
        >
          <Text style={styles.confirmButtonText}>确认</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  spacer: {
    height: 20,
  },
  confirmButton: {
    backgroundColor: THEME_COLORS.primary,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME_COLORS.primaryDark,
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  statusText: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  roundsContainer: {
    marginTop: 16,
  },
  roundsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  roundsList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  roundItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  roundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  roundName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#e6f7ff',
  },
  inactiveBadge: {
    backgroundColor: '#f5f5f5',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#1890ff',
  },
  inactiveText: {
    color: '#999',
  },
  roundDetail: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

export default ExistingChallengeForm;
