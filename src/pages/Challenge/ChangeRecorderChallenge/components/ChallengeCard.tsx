import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GameMatchPageDto } from '../../../../interface/Game';
import { THEME_COLORS } from '../../../../utils/styles';
import { ChallengeStatus } from '../../../../interface/Common';
import { useTranslation } from '../../../../hooks/useTranslation';
import CustomText from '../../../../components/CustomText';
interface ChallengeCardProps {
  item: GameMatchPageDto;
  onEditPress: (challengeId: number | undefined) => void;
}

export const ChallengeCard = React.memo((props: ChallengeCardProps) => {
  const { item, onEditPress } = props;
  const { t } = useTranslation();

  // 处理编辑按钮点击
  const handleEditPress = useCallback(() => {
    onEditPress(item.id);
  }, [item.id, onEditPress]);

  // 根据挑战状态获取对应的状态文案和样式
  const statusInfo = useMemo(() => {
    let statusText = '';
    let backgroundColor = '';
    let textColor = '';
    switch (item.isEnabled) {
      case ChallengeStatus.IN_PROGRESS:
        statusText = t('challenge.status.inProgress');
        backgroundColor = '#52c41a20';
        textColor = '#52c41a';
        break;
      case ChallengeStatus.FUNDRAISING:
        statusText = t('challenge.status.fundraising');
        backgroundColor = '#1890ff20';
        textColor = '#1890ff';
        break;
      case ChallengeStatus.FUNDRAISING_COMPLETED:
        statusText = t('challenge.status.fundraisingCompleted');
        backgroundColor = '#faad1420';
        textColor = '#faad14';
        break;
    }

    return {
      statusText,
      style: {
        backgroundColor,
        textColor,
      },
    };
  }, [item.isEnabled, t]);

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <CustomText style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
          {item.name || '-'}
        </CustomText>
        <View style={[styles.statusTag, { backgroundColor: statusInfo.style.backgroundColor }]}>
          <CustomText style={[styles.statusText, { color: statusInfo.style.textColor }]}>
            {statusInfo.statusText}
          </CustomText>
        </View>
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemLeft}>
          <View style={styles.itemRow}>
            <CustomText style={styles.label}>{t('challenge.location')}:</CustomText>
            <CustomText style={styles.value}>{item.addressName || '-'}</CustomText>
          </View>
          <View style={styles.itemRow}>
            <CustomText style={styles.label}>{t('challenge.time')}:</CustomText>
            <CustomText style={styles.value}>{item.gameDate || '-'}</CustomText>
          </View>
          <View style={styles.itemRow}>
            <CustomText style={styles.label}>{t('challenge.pitcher')}:</CustomText>
            <CustomText style={styles.value}>{item.playPersonName || '-'}</CustomText>
          </View>
          <View style={styles.itemRow}>
            <CustomText style={styles.label}>{t('challenge.recorder')}:</CustomText>
            <CustomText style={styles.value}>{item.docPersonName || '-'}</CustomText>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditPress} activeOpacity={0.7}>
          <MaterialIcons name="edit" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemContent: {
    flexDirection: 'row',
  },
  itemLeft: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_COLORS.primary,
    alignSelf: 'center',
  },
});
