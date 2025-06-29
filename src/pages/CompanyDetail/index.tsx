import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBusinessList } from '../../api/services/businessService';
import { BusinessDto } from '../../interface/Business';
import { InterestSwitchType, AccountType, InterestStatus } from '../../interface/Finance';
import { THEME_COLORS } from '../../utils/styles';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
import { useTranslation } from '../../hooks/useTranslation';
import { useRole } from '../../hooks/useRole';
import CustomText from '../../components/CustomText';
import FinanceSettingModal from '../../bizComponents/FinanceSettingModal';
import { RootStackScreenProps } from '../router';

type CompanyDetailScreenProps = RootStackScreenProps<'CompanyDetail'>;

interface FinanceSettingData {
  groupCode: string;
  settingType: InterestSwitchType;
  isEnabled: number;
  interestRate: string;
}

export const CompanyDetailScreen: React.FC<CompanyDetailScreenProps> = React.memo(({ navigation, route }) => {
  const { t } = useTranslation();
  const { isGroup } = useRole();
  const { code } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [businessList, setBusinessList] = useState<BusinessDto[]>([]);

  // 设置弹窗相关状态
  const [settingModalVisible, setSettingModalVisible] = useState<boolean>(false);
  const [currentSettingData, setCurrentSettingData] = useState<FinanceSettingData>({
    groupCode: '',
    settingType: InterestSwitchType.CURRENT,
    isEnabled: 0,
    interestRate: '',
  });

  // 获取公司人员列表
  const fetchBusinessList = useCallback(async () => {
    setLoading(true);
    const result = await getBusinessList({ code });
    setBusinessList(result);
    setLoading(false);
  }, [code]);

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 打开设置弹窗
  const handleOpenSetting = useCallback((business: BusinessDto, settingType: InterestSwitchType) => {
    setCurrentSettingData({
      groupCode: business.code,
      settingType,
      isEnabled: 0,
      interestRate: '',
    });
    setSettingModalVisible(true);
  }, []);

  // 关闭设置弹窗
  const handleCloseSetting = useCallback(() => {
    setSettingModalVisible(false);
    setCurrentSettingData({
      groupCode: '',
      settingType: InterestSwitchType.CURRENT,
      isEnabled: 0,
      interestRate: '',
    });
  }, []);

  // 更新设置数据
  const updateSettingData = useCallback((key: keyof FinanceSettingData, value: any) => {
    setCurrentSettingData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // 设置成功回调
  const handleSettingSuccess = useCallback(() => {
    fetchBusinessList();
  }, [fetchBusinessList]);

  // 渲染导航栏
  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('company.companyDetail')}</CustomText>
        <View style={styles.headerRight} />
      </View>
    ),
    [handleBack, t],
  );

  // 渲染人员项
  const renderBusinessItem = useCallback(
    ({ item }: { item: BusinessDto }) => {
      const handlePointsPress = () => {
        navigation.navigate('MyPoints', { code: item.code });
      };

      // 计算利息显示文本
      const currentInterestDisplay =
        item.currentInterestType === InterestStatus.ENABLED ? `${item.currentInterestRateStr}%` : t('finance.disabled');

      const fixedInterestDisplay =
        item.fixedInterestType === InterestStatus.ENABLED ? `${item.fixedInterestRateStr}%` : t('finance.disabled');

      return (
        <View style={styles.businessItem}>
          <View style={styles.businessHeader}>
            <CustomText style={styles.businessName}>{item.name}</CustomText>
            <CustomText style={styles.businessCode}>
              {t('company.code')}: {item.code}
            </CustomText>
          </View>
          <View style={styles.businessDetails}>
            <TouchableOpacity onPress={handlePointsPress} activeOpacity={0.7}>
              <View style={styles.detailRow}>
                <CustomText style={styles.detailLabel}>{t('company.availablePoints')}:</CustomText>
                <CustomText style={styles.detailValue}>{item.availablePoints.toLocaleString()}</CustomText>
                <Icon name="chevron-right" size={16} color="#bbb" style={styles.arrowIcon} />
              </View>
            </TouchableOpacity>
            <View style={styles.detailRow}>
              <CustomText style={styles.detailLabel}>{t('company.frozenPoints')}:</CustomText>
              <CustomText style={styles.detailValue}>{item.frozenPoints.toLocaleString()}</CustomText>
            </View>
            <View style={styles.detailRow}>
              <CustomText style={styles.detailLabel}>{t('company.profit')}:</CustomText>
              <CustomText style={styles.detailValue}>{item.profitStr}</CustomText>
            </View>

            {/* 利息信息 */}
            <View style={styles.detailRow}>
              <CustomText style={styles.detailLabel}>{t('finance.currentInterest')}:</CustomText>
              <CustomText
                style={[
                  styles.detailValue,
                  item.currentInterestType === InterestStatus.ENABLED
                    ? styles.enabledInterest
                    : styles.disabledInterest,
                ]}
              >
                {currentInterestDisplay}
              </CustomText>
            </View>
            <View style={styles.detailRow}>
              <CustomText style={styles.detailLabel}>{t('finance.fixedInterest')}:</CustomText>
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
            {isGroup && (
              <View style={styles.adminActionsContainer}>
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => handleOpenSetting(item, InterestSwitchType.CURRENT)}
                  activeOpacity={0.7}
                >
                  <Icon name="settings" size={16} color="#fff" />
                  <CustomText style={styles.settingButtonText}>{t('finance.currentSettings')}</CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.settingButton, styles.fixedSettingButton]}
                  onPress={() => handleOpenSetting(item, InterestSwitchType.FIXED)}
                  activeOpacity={0.7}
                >
                  <Icon name="account-balance" size={16} color="#fff" />
                  <CustomText style={styles.settingButtonText}>{t('finance.fixedSettings')}</CustomText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      );
    },
    [t, isGroup, handleOpenSetting, navigation],
  );

  useEffect(() => {
    fetchBusinessList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <CustomText style={styles.loadingText}>{t('common.loading')}</CustomText>
        </View>
      ) : (
        <FlatList
          data={businessList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBusinessItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CustomText style={styles.emptyText}>{t('common.noData')}</CustomText>
            </View>
          }
        />
      )}

      {/* 设置弹窗 */}
      <FinanceSettingModal
        visible={settingModalVisible}
        settingData={currentSettingData}
        userType={AccountType.PERSON}
        onClose={handleCloseSetting}
        onSuccess={handleSettingSuccess}
        onSettingChange={updateSettingData}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  headerRight: {
    width: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingVertical: 10,
  },
  businessItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  businessCode: {
    fontSize: 14,
    color: '#666',
  },
  businessDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    paddingTop: 12,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  interestStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  interestStatusText: {
    marginRight: 10,
  },
  interestButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 60,
    alignItems: 'center',
  },
  interestButtonEnable: {
    backgroundColor: '#4CAF50',
  },
  interestButtonDisable: {
    backgroundColor: '#f44336',
  },
  interestButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  settingButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
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
  enabledInterest: {
    color: '#00b894',
    fontWeight: '600',
  },
  disabledInterest: {
    color: '#5F6369',
  },
  fixedSettingButton: {
    backgroundColor: '#00b894',
  },
});
