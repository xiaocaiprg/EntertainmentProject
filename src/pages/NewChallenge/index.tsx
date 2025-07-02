import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Alert, StyleSheet, SafeAreaView, StatusBar, View, TouchableOpacity } from 'react-native';
import { THEME_COLORS } from '../../utils/styles';
import CustomText from '../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NewChallengeForm } from './components/NewChallengeForm';
import { createChallenge, getAddressList } from '../../api/services/gameService';
import { getBusinessList } from '../../api/services/businessService';
import { getCompanyList } from '../../api/services/companyService';
import { BusinessDto } from '../../interface/Business';
import { CompanyDto } from '../../interface/Company';
import { UserType } from '../../interface/Common';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
import { AddressInfo, ChallengeCreateParams } from '../../interface/Game';
import { formatDate } from '../../utils/date';
import { validateChallengeParams } from './utils/validation';
import { ChallengeFormData, CurrencyType } from './interface/IModuleProps';
import { ChallengeType, CompanyType, FundraisingType } from '../../interface/Common';
import DropdownSelect from '../../components/DropdownSelect';
import RadioGroup from '../../components/RadioGroup';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import { RootStackScreenProps } from '../router';

export const NewChallengeScreen: React.FC<RootStackScreenProps<'NewChallenge'>> = React.memo((props) => {
  const { navigation, route } = props;
  const { raceId } = route.params || {};

  const [operatorList, setOperatorList] = useState<BusinessDto[]>([]);
  const [locationList, setLocationList] = useState<AddressInfo[]>([]);
  const [companyList, setCompanyList] = useState<CompanyDto[]>([]);
  const [selectedChallengeType, setSelectedChallengeType] = useState<ChallengeType | ''>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const lastSubmitTimeRef = useRef<number>(0);
  const throttleDelayRef = useRef<number>(1000); // 1秒的节流延迟

  // 使用单一状态管理表单数据
  const [formData, setFormData] = useState<ChallengeFormData>({
    challengeType: '',
    operatorCode: '',
    locationId: 0,
    name: '',
    date: new Date(),
    principal: '',
    initialBetAmount: 0, // 默认投注基数
    currency: CurrencyType.HKD, // 默认币种为HKD
    fundraisingType: FundraisingType.PUBLIC, // 默认公开募资
    selectedCompanyList: [], // 默认空数组
  });

  // 处理表单数据变更
  const handleFormChange = useCallback((newData: Partial<ChallengeFormData>) => {
    setFormData((prevData: ChallengeFormData) => ({
      ...prevData,
      ...newData,
    }));
    console.log('表单数据已更新:', newData);
  }, []);

  // 处理挑战类型变更
  const handleChallengeTypeChange = useCallback((type: ChallengeType) => {
    setSelectedChallengeType(type);
    setFormData((prevData) => ({
      ...prevData,
      challengeType: type,
      // 根据挑战类型重置投注基数
      initialBetAmount: type === ChallengeType.FREE_FIGHT ? [] : 0,
    }));
  }, []);

  // 处理募资方式变更
  const handleFundraisingTypeChange = useCallback((type: FundraisingType) => {
    setFormData((prevData) => ({
      ...prevData,
      fundraisingType: type,
      selectedCompanyList: type === FundraisingType.PUBLIC ? [] : prevData.selectedCompanyList,
    }));
  }, []);

  // 处理公司选择变更
  const handleCompanySelectionChange = useCallback((selectedCompanies: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedCompanyList: selectedCompanies,
    }));
  }, []);

  // 使用节流控制的提交函数
  const handleConfirm = useCallback(() => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTimeRef.current;

    // 如果距离上次提交的时间小于节流延迟，或者当前正在提交中，则直接返回
    if (timeSinceLastSubmit < throttleDelayRef.current || isSubmitting) {
      console.log('节流控制：拒绝重复提交', timeSinceLastSubmit);
      return;
    }

    // 更新最后提交时间
    lastSubmitTimeRef.current = now;

    // 设置提交状态
    setIsSubmitting(true);

    // 新增挑战
    const params: ChallengeCreateParams = {
      name: formData.name.trim(),
      playPersonCode: formData.operatorCode,
      addressInfoId: formData.locationId,
      gameDate: formData.date ? formatDate(formData.date, 'YYYY-MM-DD') : '',
      principal: parseFloat(formData.principal),
      baseNumberList: Array.isArray(formData.initialBetAmount)
        ? formData.initialBetAmount
        : [formData.initialBetAmount],
      playRuleCode: formData.challengeType,
      currency: formData.currency,
      contributionType: formData.fundraisingType,
      investCompanyCodeList:
        formData.fundraisingType === FundraisingType.TARGETED ? formData.selectedCompanyList : undefined,
    };

    // 校验参数
    const validation = validateChallengeParams(params);
    if (!validation.isValid) {
      Alert.alert('提示', validation.errorMessage || '表单填写有误');
      setIsSubmitting(false);
      return;
    }

    // 校验定向募资时必须选择公司
    if (formData.fundraisingType === FundraisingType.TARGETED && formData.selectedCompanyList.length === 0) {
      Alert.alert('提示', '定向募资时必须选择至少一个投资公司');
      setIsSubmitting(false);
      return;
    }

    if (raceId) {
      params.raceId = raceId;
    }

    createChallenge(params)
      .then((res) => {
        if (res) {
          Alert.alert('成功', '挑战创建成功');
          navigation.navigate('Main');
        }
      })
      .catch((err) => {
        console.log('新增挑战失败', err.message);
        Alert.alert('提示', err.message);
      })
      .finally(() => {
        // 请求完成后，重置提交状态
        setIsSubmitting(false);
      });
  }, [formData, navigation, raceId, isSubmitting]);

  // 处理返回按钮点击
  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  useEffect(() => {
    getBusinessList({ type: UserType.PLAYPERSON }).then((res) => {
      setOperatorList(res || []);
    });
    getAddressList({ pageNum: 1, pageSize: 999 }).then((res) => {
      setLocationList(res?.records || []);
    });
    getCompanyList({ type: CompanyType.INVEST }).then((res) => {
      setCompanyList(res || []);
    });
  }, []);

  // 挑战类型选项
  const challengeTypes = useMemo(
    () => [
      { label: '无止盈过关', value: ChallengeType.NO_PROFIT_LIMIT },
      { label: '平注', value: ChallengeType.EVEN_BET },
      { label: '自由搏击', value: ChallengeType.FREE_FIGHT },
      // 可以在这里添加更多的挑战类型
    ],
    [],
  );

  // 募资方式选项
  const fundraisingOptions = useMemo(
    () => [
      { label: '公开募资', value: FundraisingType.PUBLIC },
      { label: '定向募资', value: FundraisingType.TARGETED },
    ],
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>新增挑战</CustomText>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <View style={styles.stepContainer}>
          <View style={styles.stepNumberContainer}>
            <View style={styles.stepNumberActive}>
              <CustomText style={styles.stepNumberText}>1</CustomText>
            </View>
            <View style={[styles.stepLine, selectedChallengeType ? styles.stepLineActive : {}]} />
            <View style={[styles.stepNumber, selectedChallengeType ? styles.stepNumberActive : {}]}>
              <CustomText style={styles.stepNumberText}>2</CustomText>
            </View>
          </View>
          <View style={styles.stepLabelContainer}>
            <CustomText style={[styles.stepLabel, styles.stepLabelActive]}>选择打法</CustomText>
            <CustomText style={[styles.stepLabel, selectedChallengeType ? styles.stepLabelActive : {}]}>
              填写挑战信息
            </CustomText>
          </View>
        </View>

        <View style={styles.challengeTypeContainer}>
          <CustomText style={styles.labelText}>选择打法</CustomText>
          <DropdownSelect
            options={challengeTypes}
            selectedValue={selectedChallengeType}
            placeholder="请选择打法"
            onSelect={handleChallengeTypeChange}
            valueKey="value"
            labelKey="label"
            zIndex={4000}
            zIndexInverse={1000}
            style={{
              selectContainer: {
                marginBottom: 0,
              },
              dropdown: {
                minHeight: 40,
              },
            }}
          />
        </View>

        {selectedChallengeType ? (
          <>
            <View style={styles.fundraisingContainer}>
              <CustomText style={styles.labelText}>募资方式</CustomText>
              <RadioGroup
                options={fundraisingOptions}
                selectedValue={formData.fundraisingType}
                onSelect={handleFundraisingTypeChange}
              />
            </View>

            {formData.fundraisingType === FundraisingType.TARGETED && (
              <View style={styles.companySelectContainer}>
                <CustomText style={styles.labelText}>选择投资公司</CustomText>
                <MultiSelectDropdown
                  options={companyList}
                  selectedValues={formData.selectedCompanyList}
                  onSelectionChange={handleCompanySelectionChange}
                  placeholder="请选择投资公司"
                  valueKey="code"
                  labelKey="name"
                  zIndex={1700}
                  zIndexInverse={2300}
                  style={{
                    selectContainer: {
                      marginBottom: 0,
                    },
                    dropdown: {
                      minHeight: 40,
                    },
                  }}
                />
              </View>
            )}

            <NewChallengeForm
              challengeType={selectedChallengeType}
              operators={operatorList}
              locations={locationList}
              formData={formData}
              onChange={handleFormChange}
              onConfirm={handleConfirm}
            />
          </>
        ) : (
          <View style={styles.instructionContainer}>
            <Icon name="arrow-upward" size={48} color={THEME_COLORS.primary} />
            <CustomText style={styles.instructionText}>请先选择打法</CustomText>
            <CustomText style={styles.instructionSubText}>选择后将显示相应的挑战表单</CustomText>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 20,
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    zIndex: 1,
  },
  stepContainer: {
    marginBottom: 10,
  },
  stepNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepLine: {
    height: 2,
    flex: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  stepLineActive: {
    backgroundColor: THEME_COLORS.primary,
  },
  stepLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  stepLabel: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    width: '40%',
  },
  stepLabelActive: {
    color: THEME_COLORS.primary,
    fontWeight: '600',
  },
  challengeTypeContainer: {
    marginBottom: 5,
  },
  fundraisingContainer: {
    marginBottom: 5,
  },
  companySelectContainer: {
    marginBottom: 5,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
    marginTop: 4,
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 20,
    marginBottom: 10,
  },
  instructionSubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default NewChallengeScreen;
