import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getPlayer, assignPlayer } from '../../../api/services/playerService';
import { getBusinessList } from '../../../api/services/businessService';
import { MatchPlayerDetailDto, AssignPlayerParams, GameMatchPlayerDto } from '../../../interface/Player';
import { UserType } from '../../../interface/Common';
import { THEME_COLORS } from '../../../utils/styles';
import { BusinessDto } from '../../../interface/Business';
import DropdownSelect from '../../../components/DropdownSelect';
import ConfirmModal from '../../../components/ConfirmModal';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomText from '../../../components/CustomText';

interface AssignmentDetailProps {
  matchId: number;
  onBack: () => void;
}

interface LocalPitcher extends MatchPlayerDetailDto {
  isNew?: boolean;
  uniqueId: string;
}

export const AssignmentDetail = React.memo((props: AssignmentDetailProps) => {
  const { matchId, onBack } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [matchPlayer, setMatchPlayer] = useState<GameMatchPlayerDto | null>(null);
  const [localPitchers, setLocalPitchers] = useState<LocalPitcher[]>([]);
  const [pitcherList, setPitcherList] = useState<BusinessDto[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    customContent?: React.ReactNode;
  }>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // 关闭确认弹窗
  const closeConfirmModal = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, visible: false }));
  }, []);

  // 获取挑战详情
  const fetchChallengeDetail = useCallback(async () => {
    setLoading(true);
    const res = await getPlayer(String(matchId));
    if (res) {
      setMatchPlayer(res);
      // 初始化本地投手列表
      const initialPitchers: LocalPitcher[] = res.matchPlayerDetailDtoList.map((pitcher, index) => ({
        ...pitcher,
        isNew: false,
        uniqueId: `existing_${Date.now()}_${index}`,
      }));
      setLocalPitchers(initialPitchers);
    }
    setLoading(false);
  }, [matchId]);

  // 获取投手列表
  const fetchPitcherList = useCallback(async () => {
    const params = {
      type: UserType.PLAYPERSON,
    };
    const res = await getBusinessList(params);
    if (res) {
      setPitcherList(res);
    }
  }, []);

  // 初始加载数据
  useEffect(() => {
    fetchChallengeDetail();
    fetchPitcherList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 添加新投手记录
  const handleAddPitcher = useCallback(() => {
    const newPitcher: LocalPitcher = {
      playerCode: '',
      playerName: t('assignPitcher.pleaseSelectPitcher'),
      rate: 0,
      type: 2,
      isNew: true,
      uniqueId: `new_${Date.now()}`,
    };

    setLocalPitchers((prev) => [...prev, newPitcher]);
    setHasChanges(true);
  }, [t]);

  // 处理投手选择
  const handlePitcherSelect = useCallback(
    (uniqueId: string, selectedPlayerCode: string) => {
      const selectedPitcher = pitcherList.find((p) => p.code === selectedPlayerCode);
      if (!selectedPitcher) {
        return;
      }

      setLocalPitchers((prev) =>
        prev.map((p) =>
          p.uniqueId === uniqueId
            ? { ...p, playerCode: selectedPlayerCode, playerName: selectedPitcher.name || '' }
            : p,
        ),
      );
      setHasChanges(true);
    },
    [pitcherList],
  );

  // 处理下拉框状态变化
  const handleDropdownStateChange = useCallback(
    (uniqueId: string, isOpen: boolean) => {
      if (isOpen) {
        setActiveDropdown(uniqueId);
      } else if (activeDropdown === uniqueId) {
        setActiveDropdown(null);
      }
    },
    [activeDropdown],
  );

  // 删除投手
  const handleDeletePitcher = useCallback(
    (uniqueId: string) => {
      const pitcher = localPitchers.find((p) => p.uniqueId === uniqueId);
      if (!pitcher) {
        return;
      }

      if (pitcher.type === 1) {
        Alert.alert(t('common.error'), t('assignPitcher.mainPitcherCannotDelete'));
        return;
      }

      setConfirmModal({
        visible: true,
        title: t('assignPitcher.confirmDelete'),
        message: t('assignPitcher.confirmDeletePitcher'),
        onConfirm: () => {
          setLocalPitchers((prev) => prev.filter((p) => p.uniqueId !== uniqueId));
          setHasChanges(true);
          closeConfirmModal();
        },
      });
    },
    [localPitchers, t, closeConfirmModal],
  );

  // 调整投手比例
  const handleRateChange = useCallback((uniqueId: string, newRate: number) => {
    if (newRate < 0 || newRate > 100) {
      return;
    }

    setLocalPitchers((prev) => prev.map((p) => (p.uniqueId === uniqueId ? { ...p, rate: newRate } : p)));
    setHasChanges(true);
  }, []);

  // 校验投手数据
  const validatePitchers = useCallback(() => {
    // 检查是否有变更
    if (!hasChanges) {
      Alert.alert(t('common.error'), t('assignPitcher.noChangesToSave'));
      return false;
    }
    // 检查是否有空的playerCode
    const emptyPlayerCodes = localPitchers.filter((p) => !p.playerCode || p.playerCode.trim() === '');
    if (emptyPlayerCodes.length > 0) {
      Alert.alert(t('common.error'), t('assignPitcher.playerCodeRequired'));
      return false;
    }

    // 获取所有有效的投手
    const validPitchers = localPitchers.filter((p) => p.playerCode);
    if (validPitchers.length === 0) {
      Alert.alert(t('common.error'), t('assignPitcher.atLeastOnePitcher'));
      return false;
    }

    // 检查是否有重复的投手
    const playerCodes = validPitchers.map((p) => p.playerCode);
    const uniquePlayerCodes = [...new Set(playerCodes)];
    if (playerCodes.length !== uniquePlayerCodes.length) {
      Alert.alert(t('common.error'), t('assignPitcher.pitcherAlreadyExists'));
      return false;
    }

    // 检查总比例
    const totalRate = validPitchers.reduce((sum, p) => sum + p.rate, 0);
    if (totalRate !== 100) {
      Alert.alert(t('common.error'), t('assignPitcher.totalRateMustBe100'));
      return false;
    }

    return true;
  }, [localPitchers, t, hasChanges]);

  // 执行保存操作
  const performSave = useCallback(async () => {
    try {
      setSubmitting(true);
      // 获取所有有效的投手（包括现有的和新增的）
      const validPitchers = localPitchers.filter((p) => p.playerCode);
      const params: AssignPlayerParams[] = validPitchers.map((pitcher) => ({
        matchId: matchId,
        playerCode: pitcher.playerCode || '',
        rate: pitcher.rate,
        type: pitcher.type,
      }));

      await assignPlayer(params);

      setSubmitting(false);
      setHasChanges(false);
      closeConfirmModal();
      Alert.alert(t('common.success'), t('assignPitcher.assignSuccess'), [
        {
          text: t('common.ok'),
          onPress: () => {
            fetchChallengeDetail();
          },
        },
      ]);
    } catch (error: any) {
      setSubmitting(false);
      Alert.alert(t('common.error'), error.message);
    }
  }, [localPitchers, matchId, t, fetchChallengeDetail, closeConfirmModal]);

  // 保存投手分配
  const handleSave = useCallback(async () => {
    if (!validatePitchers()) {
      return;
    }
    const validPitchers = localPitchers.filter((p) => p.playerCode);
    const customContent = (
      <View style={styles.pitcherListContainer}>
        {validPitchers.map((pitcher) => (
          <View key={pitcher.uniqueId} style={styles.pitcherListItem}>
            <CustomText style={styles.pitcherListText}>
              {pitcher.playerName} ({pitcher.rate}%)
            </CustomText>
          </View>
        ))}
      </View>
    );

    setConfirmModal({
      visible: true,
      title: t('assignPitcher.confirmSave'),
      message: t('assignPitcher.confirmSaveMessage'),
      customContent,
      onConfirm: performSave,
    });
  }, [localPitchers, t, validatePitchers, performSave]);

  // 渲染投手列表
  const renderPitcherList = useCallback(() => {
    if (localPitchers.length === 0) {
      return <CustomText style={styles.emptyText}>{t('assignPitcher.pleaseSelectPitcher')}</CustomText>;
    }

    return localPitchers.map((pitcher: LocalPitcher, index: number) => (
      <View key={pitcher.uniqueId} style={styles.pitcherItem}>
        <View style={styles.pitcherHeader}>
          <CustomText style={styles.pitcherTitle}>
            {pitcher.type === 1 ? t('assignPitcher.mainPitcher') : `${t('assignPitcher.vicePitcher')} ${index}`}
          </CustomText>
          {pitcher.type !== 1 && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePitcher(pitcher.uniqueId)}>
              <Icon name="delete" size={18} color="#ff4444" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.pitcherContent}>
          <View style={styles.nameRow}>
            <CustomText style={styles.label}>{t('assignPitcher.name')}:</CustomText>
            {pitcher.isNew ? (
              <View style={styles.dropdownContainer}>
                <DropdownSelect
                  options={pitcherList}
                  selectedValue={pitcher.playerCode}
                  placeholder={t('assignPitcher.pleaseSelectPitcher')}
                  onSelect={(value) => handlePitcherSelect(pitcher.uniqueId, value)}
                  valueKey="code"
                  labelKey="name"
                  isOpen={activeDropdown === pitcher.uniqueId}
                  onStateChange={(isOpen) => handleDropdownStateChange(pitcher.uniqueId, isOpen)}
                  zIndex={3000 - index * 100}
                  zIndexInverse={1000 + index * 100}
                  style={{
                    selectContainer: {
                      marginBottom: 0,
                    },
                    dropdown: {
                      backgroundColor: '#fff',
                      minHeight: 40,
                    },
                  }}
                />
              </View>
            ) : (
              <CustomText style={styles.nameText}>{pitcher.playerName}</CustomText>
            )}
          </View>

          <View style={styles.rateRow}>
            <CustomText style={styles.label}>{t('assignPitcher.rate')}:</CustomText>
            <View style={styles.rateContainer}>
              <TouchableOpacity
                style={styles.rateButton}
                onPress={() => handleRateChange(pitcher.uniqueId, pitcher.rate - 1)}
              >
                <Icon name="remove" size={16} color="#666" />
              </TouchableOpacity>
              <View style={styles.rateInputContainer}>
                <TextInput
                  style={styles.rateInput}
                  value={pitcher.rate.toString()}
                  onChangeText={(text) => {
                    const newRate = parseInt(text, 10);
                    if (!isNaN(newRate) && newRate >= 0 && newRate <= 100) {
                      handleRateChange(pitcher.uniqueId, newRate);
                    } else if (text === '') {
                      handleRateChange(pitcher.uniqueId, 0);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                  selectTextOnFocus
                />
                <CustomText style={styles.percentText}>%</CustomText>
              </View>
              <TouchableOpacity
                style={styles.rateButton}
                onPress={() => handleRateChange(pitcher.uniqueId, pitcher.rate + 1)}
              >
                <Icon name="add" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    ));
  }, [
    localPitchers,
    t,
    handleDeletePitcher,
    handleRateChange,
    pitcherList,
    handlePitcherSelect,
    activeDropdown,
    handleDropdownStateChange,
  ]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <CustomText>{t('common.loading')}</CustomText>
      </View>
    );
  }

  if (!matchPlayer) {
    return (
      <View style={styles.errorContainer}>
        <CustomText>{t('challengeDetail.noDetail')}</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('assignPitcher.assignPitcherFor')}</CustomText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <CustomText style={styles.label}>{t('challengeDetail.challengeName')}:</CustomText>
              <CustomText style={styles.value}>{matchPlayer.name || '-'}</CustomText>
            </View>
            <View style={styles.infoItem}>
              <CustomText style={styles.label}>{t('challengeDetail.time')}:</CustomText>
              <CustomText style={styles.value}>{matchPlayer.gameDate}</CustomText>
            </View>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <CustomText style={styles.label}>{t('challengeDetail.location')}:</CustomText>
              <CustomText style={styles.value}>{matchPlayer.addressName || '-'}</CustomText>
            </View>
            <View style={styles.infoItem}>
              <CustomText style={styles.label}>{t('challengeDetail.playRule')}:</CustomText>
              <CustomText style={styles.value}>{matchPlayer.playRuleName || '-'}</CustomText>
            </View>
          </View>
        </View>

        {/* 当前投手信息 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CustomText style={styles.sectionTitle}>{t('assignPitcher.currentPitcher')}</CustomText>
            <TouchableOpacity style={styles.addButton} onPress={handleAddPitcher}>
              <Icon name="add" size={18} color="#fff" />
              <CustomText style={styles.addButtonText}>{t('common.add')}</CustomText>
            </TouchableOpacity>
          </View>
          <View style={styles.pitcherCard}>{renderPitcherList()}</View>
        </View>

        {/* 保存按钮 */}
        {hasChanges && (
          <TouchableOpacity
            style={[styles.saveButton, submitting && styles.disabledButton]}
            onPress={handleSave}
            disabled={submitting}
          >
            <CustomText style={styles.saveButtonText}>{submitting ? t('common.saving') : t('common.save')}</CustomText>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        customContent={confirmModal.customContent}
        onCancel={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        isProcessing={submitting}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 36,
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    flex: 1,
  },
  pitcherCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
  },
  pitcherItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pitcherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pitcherTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    padding: 4,
  },
  pitcherContent: {
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pitcherName: {
    fontSize: 14,
    color: '#333',
  },
  nameText: {
    fontSize: 14,
    color: '#333',
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 50,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  rateButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  rateInput: {
    width: 50,
    height: 28,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  percentText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  saveButton: {
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownContainer: {
    flex: 1,
    marginLeft: 8,
  },
  pitcherListContainer: {
    padding: 10,
  },
  pitcherListItem: {
    marginBottom: 10,
  },
  pitcherListText: {
    fontSize: 14,
    color: '#333',
  },
});
