import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCompanyList } from '../../../api/services/companyService';
import { CompanyDto, CompanyListParams } from '../../../interface/Company';
import { InterestSwitchType, AccountType, InterestStatus } from '../../../interface/Finance';
import { CompanyType } from '../../../interface/Common';
import { THEME_COLORS } from '../../../utils/styles';
import { isIOS, STATUS_BAR_HEIGHT } from '../../../utils/platform';
import { useTranslation } from '../../../hooks/useTranslation';
import { useRole } from '../../../hooks/useRole';
import CustomText from '../../../components/CustomText';
import FinanceSettingModal from '../../../bizComponents/FinanceSettingModal';
import { RootStackScreenProps } from '../../router';

type CompanyManagementScreenProps = RootStackScreenProps<'CompanyManagement'>;

interface CompanySection {
  title: string;
  type: number;
  data: CompanyDto[];
  backgroundColor: string;
}

interface FinanceSettingData {
  groupCode: string;
  settingType: InterestSwitchType;
  isEnabled: number;
  interestRate: string;
}

export const CompanyManagementScreen: React.FC<CompanyManagementScreenProps> = React.memo(({ navigation, route }) => {
  const { t } = useTranslation();
  const { isGroup } = useRole();
  const { groupCode } = route.params || {};
  const [loading, setLoading] = useState<boolean>(true);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);

  // 设置弹窗相关状态
  const [settingModalVisible, setSettingModalVisible] = useState<boolean>(false);
  const [currentSettingData, setCurrentSettingData] = useState<FinanceSettingData>({
    groupCode: '',
    settingType: InterestSwitchType.CURRENT,
    isEnabled: 0,
    interestRate: '',
  });

  // 获取公司类型名称
  const getCompanyTypeName = useCallback(
    (type: number) => {
      switch (type) {
        case CompanyType.RECORD:
          return t('company.recordCompany');
        case CompanyType.PLAY:
          return t('company.playCompany');
        case CompanyType.INVEST:
          return t('company.investCompany');
        case CompanyType.OPERATION:
          return t('company.operationCompany');
        case CompanyType.MATCH:
          return t('company.matchCompany');
        default:
          return t('company.unknownType');
      }
    },
    [t],
  );

  // 获取公司类型颜色
  const getCompanyTypeColor = useCallback((type: number) => {
    switch (type) {
      case CompanyType.RECORD:
        return '#00b894';
      case CompanyType.PLAY:
        return '#6c5ce7';
      case CompanyType.INVEST:
        return '#e17055';
      case CompanyType.OPERATION:
        return '#fdcb6e';
      case CompanyType.MATCH:
        return '#e84393';
      default:
        return '#636e72';
    }
  }, []);

  // 获取公司列表
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    const params: CompanyListParams = { isSelf: 1 };
    if (groupCode) {
      params.code = groupCode;
    }
    const result = await getCompanyList(params);
    setCompanies(result);
    setLoading(false);
  }, [groupCode]);

  // 按类型分组的公司数据
  const sectionData = useMemo(() => {
    // 固定的公司类型顺序
    const fixedTypes = [
      CompanyType.INVEST, // 投资公司
      CompanyType.PLAY, // 投手公司
      CompanyType.RECORD, // 记录公司
      CompanyType.OPERATION, // 运营公司
      CompanyType.MATCH, // 赛事公司
    ];

    const groupedCompanies = new Map<number, CompanyDto[]>();

    // 按类型分组实际数据
    companies.forEach((company) => {
      if (!groupedCompanies.has(company.type)) {
        groupedCompanies.set(company.type, []);
      }
      groupedCompanies.get(company.type)!.push(company);
    });

    // 为每个固定类型创建section
    const sections: CompanySection[] = fixedTypes.map((type) => {
      const companiesOfType = groupedCompanies.get(type) || [];

      if (companiesOfType.length > 0) {
        // 有数据的类型，显示实际公司列表
        return {
          title: getCompanyTypeName(type),
          type: type,
          data: companiesOfType.sort((a, b) => a.name.localeCompare(b.name)),
          backgroundColor: getCompanyTypeColor(type),
        };
      } else {
        // 没有数据的类型，显示"未开通"占位项
        return {
          title: getCompanyTypeName(type),
          type: type,
          data: [
            {
              id: -type, // 使用负数作为占位项的ID
              name: '未开通',
              code: '',
              availablePoints: 0,
              frozenPoints: 0,
              totalPoints: 0,
              profit: 0,
              profitStr: '',
              groupCode: '',
              groupName: '',
              role: '',
              type: type,
              isPlaceholder: true, // 标记为占位项
            } as CompanyDto & { isPlaceholder: boolean },
          ],
          backgroundColor: getCompanyTypeColor(type),
        };
      }
    });

    return sections;
  }, [companies, getCompanyTypeName, getCompanyTypeColor]);

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 打开设置弹窗
  const handleOpenSetting = useCallback((company: CompanyDto, settingType: InterestSwitchType) => {
    setCurrentSettingData({
      groupCode: company.code,
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
    fetchCompanies();
  }, [fetchCompanies]);

  // 渲染导航栏
  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>
          {groupCode ? `${t('company.title')} - ${groupCode}` : t('company.title')}
        </CustomText>
        <View style={styles.headerRight} />
      </View>
    ),
    [handleBack, t, groupCode],
  );

  // 渲染section header
  const renderSectionHeader = useCallback(({ section }: { section: CompanySection }) => {
    // 计算实际的公司数量，排除占位项
    const actualCount = section.data.filter((item) => !(item as any).isPlaceholder).length;

    return (
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionHeaderLine, { backgroundColor: section.backgroundColor }]} />
        <CustomText style={styles.sectionHeaderText}>
          {section.title} ({actualCount})
        </CustomText>
      </View>
    );
  }, []);

  // 渲染公司项
  const renderCompanyItem = useCallback(
    ({ item }: { item: CompanyDto & { isPlaceholder?: boolean } }) => {
      // 如果是占位项，显示"未开通"样式
      if (item.isPlaceholder) {
        return (
          <View style={[styles.companyItem, styles.placeholderItem]}>
            <View style={styles.placeholderContent}>
              <CustomText style={styles.placeholderText}>{item.name}</CustomText>
            </View>
          </View>
        );
      }

      // 点击公司跳转到详情页
      const handleCompanyPress = () => {
        navigation.navigate('CompanyDetail', { code: item.code });
      };
      const handlePointsPress = () => {
        navigation.navigate('MyPoints', { code: item.code });
      };

      // 计算利息显示文本
      const currentInterestDisplay =
        item.currentInterestType === InterestStatus.ENABLED ? `${item.currentInterestRateStr}%` : t('finance.disabled');

      const fixedInterestDisplay =
        item.fixedInterestType === InterestStatus.ENABLED ? `${item.fixedInterestRateStr}%` : t('finance.disabled');

      // 正常的公司项渲染
      return (
        <View style={styles.companyItem}>
          <TouchableOpacity onPress={handleCompanyPress} activeOpacity={0.7}>
            <View style={styles.companyHeader}>
              <View style={styles.companyInfo}>
                <CustomText style={styles.companyName}>{item.name}</CustomText>
                <View style={styles.codeRow}>
                  <CustomText style={styles.companyCode}>
                    {t('company.code')}: {item.code}
                  </CustomText>
                  <Icon name="chevron-right" size={16} color="#bbb" style={styles.arrowIcon} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.companyDetails}>
            <TouchableOpacity onPress={handlePointsPress} activeOpacity={0.7}>
              <View style={styles.detailRow}>
                <CustomText style={styles.detailLabel}>{t('company.availablePoints')}:</CustomText>
                <CustomText style={styles.detailValue}>{item.availablePoints.toLocaleString()}</CustomText>
                <Icon name="chevron-right" size={16} color="#bbb" style={styles.arrowIcon} />
              </View>
            </TouchableOpacity>
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
    [navigation, t, isGroup, handleOpenSetting],
  );

  useEffect(() => {
    fetchCompanies();
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
        <SectionList
          sections={sectionData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCompanyItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
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
        userType={AccountType.COMPANY}
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
    paddingTop: 10,
  },
  companyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#f1f3f4',
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  companyCode: {
    fontSize: 14,
    color: '#666',
  },
  companyDetails: {
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
    paddingVertical: 2,
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
  sectionHeaderLine: {
    width: 6,
    height: 20,
    borderRadius: 20,
    marginRight: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  placeholderItem: {
    backgroundColor: '#f8f9fa',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginLeft: 6,
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
