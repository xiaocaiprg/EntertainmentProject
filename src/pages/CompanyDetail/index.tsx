import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBusinessList } from '../../api/services/businessService';
import { BusinessDto } from '../../interface/Business';
import { THEME_COLORS } from '../../utils/styles';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
import { useTranslation } from '../../hooks/useTranslation';
import CustomText from '../../components/CustomText';
import { RootStackScreenProps } from '../router';

type CompanyDetailScreenProps = RootStackScreenProps<'CompanyDetail'>;

export const CompanyDetailScreen: React.FC<CompanyDetailScreenProps> = React.memo(({ navigation, route }) => {
  const { t } = useTranslation();
  const { code } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [businessList, setBusinessList] = useState<BusinessDto[]>([]);

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
    ({ item }: { item: BusinessDto }) => (
      <View style={styles.businessItem}>
        <View style={styles.businessHeader}>
          <CustomText style={styles.businessName}>{item.name}</CustomText>
          <CustomText style={styles.businessCode}>
            {t('company.code')}: {item.code}
          </CustomText>
        </View>
        <View style={styles.businessDetails}>
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>{t('company.availablePoints')}:</CustomText>
            <CustomText style={styles.detailValue}>{item.availablePoints.toLocaleString()}</CustomText>
          </View>
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>{t('company.frozenPoints')}:</CustomText>
            <CustomText style={styles.detailValue}>{item.frozenPoints.toLocaleString()}</CustomText>
          </View>
          <View style={styles.detailRow}>
            <CustomText style={styles.detailLabel}>{t('company.profit')}:</CustomText>
            <CustomText style={styles.detailValue}>{item.profitStr}</CustomText>
          </View>
        </View>
      </View>
    ),
    [t],
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
});
