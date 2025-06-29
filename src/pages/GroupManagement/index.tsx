import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getGroupList } from '../../api/services/groupService';
import { GroupCompanyDto } from '../../interface/Group';
import { InterestStatus, InterestSwitchType } from '../../interface/Finance';
import { THEME_COLORS } from '../../utils/styles';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
import { useTranslation } from '../../hooks/useTranslation';
import CustomText from '../../components/CustomText';
import GroupItem from './components/GroupItem';
import FinanceSettingModal from './components/FinanceSettingModal';
import { RootStackScreenProps } from '../router';

type GroupManagementScreenProps = RootStackScreenProps<'GroupManagement'>;

interface FinanceSettingData {
  groupCode: string;
  settingType: InterestSwitchType;
  isEnabled: InterestStatus;
  interestRate: string;
}

export const GroupManagementScreen: React.FC<GroupManagementScreenProps> = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<GroupCompanyDto[]>([]);

  // 设置弹窗相关状态
  const [settingModalVisible, setSettingModalVisible] = useState<boolean>(false);
  const [currentSettingData, setCurrentSettingData] = useState<FinanceSettingData>({
    groupCode: '',
    settingType: InterestSwitchType.CURRENT,
    isEnabled: InterestStatus.DISABLED,
    interestRate: '',
  });

  // 获取集团列表
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const result = await getGroupList();
    setGroups(result);
    setLoading(false);
  }, []);

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 点击集团跳转到公司管理页
  const handleGroupPress = useCallback(
    (group: GroupCompanyDto) => {
      navigation.navigate('CompanyManagement', { groupCode: group.code });
    },
    [navigation],
  );

  // 打开设置弹窗
  const handleOpenSetting = useCallback((group: GroupCompanyDto, settingType: InterestSwitchType) => {
    setCurrentSettingData({
      groupCode: group.code,
      settingType,
      isEnabled: InterestStatus.DISABLED,
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
      isEnabled: InterestStatus.DISABLED,
      interestRate: '',
    });
  }, []);

  // 更新设置数据
  const updateSettingData = useCallback((key: keyof FinanceSettingData, value: any) => {
    setCurrentSettingData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // 设置成功回调
  const handleSettingSuccess = useCallback(() => {
    fetchGroups();
  }, [fetchGroups]);

  // 渲染导航栏
  const renderHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('group.title')}</CustomText>
        <View style={styles.headerRight} />
      </View>
    ),
    [handleBack, t],
  );

  // 渲染集团项
  const renderGroupItem = useCallback(
    ({ item }: { item: GroupCompanyDto }) => (
      <GroupItem item={item} onPress={handleGroupPress} onOpenSetting={handleOpenSetting} />
    ),
    [handleGroupPress, handleOpenSetting],
  );

  useEffect(() => {
    fetchGroups();
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
          data={groups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGroupItem}
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
});
