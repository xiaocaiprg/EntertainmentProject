import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GroupCompanyDto } from '../../../interface/Group';
import { InterestSwitchType, InterestStatus } from '../../../interface/Finance';
import { useTranslation } from '../../../hooks/useTranslation';
import { useRole } from '../../../hooks/useRole';
import CustomText from '../../../components/CustomText';
import { THEME_COLORS } from '../../../utils/styles';

interface GroupItemProps {
  item: GroupCompanyDto;
  onPress: (group: GroupCompanyDto) => void;
  onOpenSetting: (group: GroupCompanyDto, settingType: InterestSwitchType) => void;
}

export const GroupItem: React.FC<GroupItemProps> = React.memo((props) => {
  const { item, onPress, onOpenSetting } = props;
  const { t } = useTranslation();
  const { isAdmin } = useRole();

  // 计算利息显示文本
  const currentInterestDisplay = useMemo(() => {
    if (item.currentInterestType === InterestStatus.ENABLED) {
      return `${item.currentInterestRateStr}%`;
    }
    return t('finance.disabled');
  }, [item.currentInterestType, item.currentInterestRateStr, t]);

  const fixedInterestDisplay = useMemo(() => {
    if (item.fixedInterestType === InterestStatus.ENABLED) {
      return `${item.fixedInterestRateStr}%`;
    }
    return t('finance.disabled');
  }, [item.fixedInterestType, item.fixedInterestRateStr, t]);

  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  const handleCurrentSetting = useCallback(() => {
    onOpenSetting(item, InterestSwitchType.CURRENT);
  }, [item, onOpenSetting]);

  const handleFixedSetting = useCallback(() => {
    onOpenSetting(item, InterestSwitchType.FIXED);
  }, [item, onOpenSetting]);

  return (
    <TouchableOpacity style={styles.groupItem} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.groupHeader}>
        <View style={styles.groupInfo}>
          <CustomText style={styles.groupName}>{item.name}</CustomText>
          <View style={styles.codeRow}>
            <CustomText style={styles.groupCode}>
              {t('group.code')}: {item.code}
            </CustomText>
            <Icon name="chevron-right" size={16} color="#bbb" style={styles.arrowIcon} />
          </View>
        </View>
      </View>
      <View style={styles.groupDetails}>
        <View style={styles.detailRow}>
          <CustomText style={styles.detailLabel}>{t('group.availablePoints')}:</CustomText>
          <CustomText style={styles.detailValue}>{item.availablePoints.toLocaleString()}</CustomText>
        </View>
        <View style={styles.detailRow}>
          <CustomText style={styles.detailLabel}>{t('group.frozenPoints')}:</CustomText>
          <CustomText style={styles.detailValue}>{item.frozenPoints.toLocaleString()}</CustomText>
        </View>
        <View style={styles.detailRow}>
          <CustomText style={styles.detailLabel}>{t('group.totalPoints')}:</CustomText>
          <CustomText style={styles.detailValue}>{item.totalPoints.toLocaleString()}</CustomText>
        </View>

        {/* 利息信息 */}
        <View style={styles.detailRow}>
          <CustomText style={styles.detailLabel}>{t('group.currentInterest')}:</CustomText>
          <CustomText
            style={[
              styles.detailValue,
              item.currentInterestType === InterestStatus.ENABLED ? styles.enabledInterest : styles.disabledInterest,
            ]}
          >
            {currentInterestDisplay}
          </CustomText>
        </View>
        <View style={styles.detailRow}>
          <CustomText style={styles.detailLabel}>{t('group.fixedInterest')}:</CustomText>
          <CustomText
            style={[
              styles.detailValue,
              item.fixedInterestType === InterestStatus.ENABLED ? styles.enabledInterest : styles.disabledInterest,
            ]}
          >
            {fixedInterestDisplay}
          </CustomText>
        </View>

        {/* 管理员功能按钮 */}
        {isAdmin && (
          <View style={styles.adminActionsContainer}>
            <TouchableOpacity style={styles.settingButton} onPress={handleCurrentSetting} activeOpacity={0.7}>
              <Icon name="settings" size={16} color="#fff" />
              <CustomText style={styles.settingButtonText}>{t('finance.currentSettings')}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingButton, styles.fixedSettingButton]}
              onPress={handleFixedSetting}
              activeOpacity={0.7}
            >
              <Icon name="account-balance" size={16} color="#fff" />
              <CustomText style={styles.settingButtonText}>{t('finance.fixedSettings')}</CustomText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  groupItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  groupCode: {
    fontSize: 14,
    color: '#666',
  },
  groupDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    paddingTop: 12,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginLeft: 6,
  },
  adminActionsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 5,
    gap: 10,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
  },
  fixedSettingButton: {
    backgroundColor: '#00b894',
  },
  settingButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  enabledInterest: {
    color: '#00b894',
    fontWeight: '600',
  },
  disabledInterest: {
    color: '#5F6369',
  },
});

export default GroupItem;
