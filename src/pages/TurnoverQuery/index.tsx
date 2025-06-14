import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCompanyList } from '../../api/services/companyService';
import { getMatchTurnOver } from '../../api/services/gameService';
import { THEME_COLORS } from '../../utils/styles';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
import { FilterComponent } from './components/FilterComponent';
import { ResultList } from './components/ResultList';
import { QueryCondition } from './interface/ITurnoverQuery';
import { UserType } from '../../interface/Common';
import { GameTurnOverDto } from '../../interface/Game';
import { Company } from '../../interface/Company';
import CustomText from '../../components/CustomText';
import { useTranslation } from '../../hooks/useTranslation';

export const TurnoverQueryScreen = React.memo(() => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<GameTurnOverDto | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentUserType, setCurrentUserType] = useState<number>(UserType.INVESTOR);

  // 用户类型选项
  const userTypeOptions = useMemo(
    () => [
      { label: t('turnoverQuery.userType.investor'), value: UserType.INVESTOR },
      { label: t('turnoverQuery.userType.recorder'), value: UserType.RECORDER },
      { label: t('turnoverQuery.userType.playperson'), value: UserType.PLAYPERSON },
      { label: t('turnoverQuery.userType.operation'), value: UserType.OPERATIONPERSON },
    ],
    [t],
  );

  const fetchCompanies = useCallback(async () => {
    const result = await getCompanyList({
      type: currentUserType,
    });
    if (result) {
      setCompanies(result);
    }
  }, [currentUserType]);

  const handleUserTypeChange = useCallback((type: number) => {
    setCurrentUserType(type);
    setCompanies([]);
    setSearchResults(null);
  }, []);

  const renderCategoryTabs = useCallback(
    () => (
      <View style={styles.tabContainer}>
        {userTypeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[styles.tabItem, currentUserType === option.value && styles.tabItemActive]}
            onPress={() => handleUserTypeChange(option.value)}
          >
            <CustomText style={[styles.tabText, currentUserType === option.value && styles.tabTextActive]}>
              {option.label}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
    ),
    [currentUserType, handleUserTypeChange, userTypeOptions],
  );

  // 处理搜索提交
  const handleSearch = useCallback(async (params: QueryCondition) => {
    setLoading(true);
    const result = await getMatchTurnOver({
      startTime: params.startTime,
      endTime: params.endTime,
      companyCode: params.companyCode,
      businessCode: params.businessCode,
    });
    if (result) {
      setSearchResults(result);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserType]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('turnoverQuery.title')}</CustomText>
        <View style={styles.headerRight} />
      </View>
      {renderCategoryTabs()}
      <FilterComponent onSearch={handleSearch} companyList={companies} currentUserType={currentUserType} />
      <ResultList loading={loading} data={searchResults} />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLORS.text.primary,
  },
  headerRight: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: THEME_COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  tabTextActive: {
    color: THEME_COLORS.primary,
    fontWeight: '600',
  },
});
