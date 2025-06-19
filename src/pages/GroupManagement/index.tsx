import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getGroupList } from '../../api/services/groupService';
import { GroupCompanyDto } from '../../interface/Group';
import { THEME_COLORS } from '../../utils/styles';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
import { useTranslation } from '../../hooks/useTranslation';
import CustomText from '../../components/CustomText';
import { RootStackScreenProps } from '../router';

type GroupManagementScreenProps = RootStackScreenProps<'GroupManagement'>;

export const GroupManagementScreen: React.FC<GroupManagementScreenProps> = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<GroupCompanyDto[]>([]);

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
      <TouchableOpacity style={styles.groupItem} onPress={() => handleGroupPress(item)} activeOpacity={0.7}>
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
        </View>
      </TouchableOpacity>
    ),
    [handleGroupPress, t],
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
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginLeft: 6,
  },
});
