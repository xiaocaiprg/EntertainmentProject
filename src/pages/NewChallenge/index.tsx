import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Alert, StyleSheet, SafeAreaView, StatusBar, View, TouchableOpacity, Text } from 'react-native';
import { THEME_COLORS } from '../../utils/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NewChallengeForm } from './components/NewChallengeForm';
import { getOperatorList, createChallenge, getAddressList } from '../../api/services/gameService';
import { UserResult } from '../../interface/User';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
import { AddressInfo, ChallengeCreateParams } from '../../interface/Game';
import { formatDate } from '../../utils/date';
import { validateChallengeParams } from './utils/validation';
import { ChallengeFormData } from './interface/IModuleProps';
import { ChallengeType } from '../../interface/Common';
import DropdownSelect from '../../components/DropdownSelect';
import { INITIAL_BET_AMOUNT } from '../../constants/betAmounts';
import { RootStackScreenProps } from '../router';

export const NewChallengeScreen: React.FC<RootStackScreenProps<'NewChallenge'>> = React.memo((props) => {
  const { navigation, route } = props;
  const { raceId } = route.params || {};

  const [operatorList, setOperatorList] = useState<UserResult[]>([]);
  const [locationList, setLocationList] = useState<AddressInfo[]>([]);
  const [selectedChallengeType, setSelectedChallengeType] = useState<ChallengeType | ''>('');

  // 使用单一状态管理表单数据
  const [formData, setFormData] = useState<ChallengeFormData>({
    challengeType: '',
    operatorCode: '',
    locationId: 0,
    name: '',
    date: new Date(),
    principal: '',
    initialBetAmount: INITIAL_BET_AMOUNT, // 默认投注基数
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
    }));
  }, []);

  // 处理确认按钮点击
  const handleConfirm = useCallback(() => {
    // 新增挑战
    const params: ChallengeCreateParams = {
      name: formData.name.trim(),
      playPersonCode: formData.operatorCode,
      addressInfoId: formData.locationId,
      gameDate: formData.date ? formatDate(formData.date, 'YYYY-MM-DD') : '',
      principal: parseFloat(formData.principal),
      baseNumber: formData.initialBetAmount,
      playRuleCode: formData.challengeType,
    };

    // 校验参数
    const validation = validateChallengeParams(params);
    if (!validation.isValid) {
      Alert.alert('提示', validation.errorMessage || '表单填写有误');
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
      });
  }, [formData, navigation, raceId]);

  // 处理返回按钮点击
  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  useEffect(() => {
    getOperatorList({ pageNum: 1, pageSize: 999, type: 2 }).then((res) => {
      setOperatorList(res?.records || []);
    });
    getAddressList({ pageNum: 1, pageSize: 999 }).then((res) => {
      setLocationList(res?.records || []);
    });
  }, []);

  // 挑战类型选项
  const challengeTypes = useMemo(
    () => [
      { label: '无止盈过关', value: ChallengeType.NO_PROFIT_LIMIT },
      { label: '平注', value: ChallengeType.EVEN_BET },
      // 可以在这里添加更多的挑战类型
    ],
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>新增挑战</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <View style={styles.stepContainer}>
          <View style={styles.stepNumberContainer}>
            <View style={styles.stepNumberActive}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={[styles.stepLine, selectedChallengeType ? styles.stepLineActive : {}]} />
            <View style={[styles.stepNumber, selectedChallengeType ? styles.stepNumberActive : {}]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
          </View>
          <View style={styles.stepLabelContainer}>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>选择打法</Text>
            <Text style={[styles.stepLabel, selectedChallengeType ? styles.stepLabelActive : {}]}>填写挑战信息</Text>
          </View>
        </View>

        <View style={styles.challengeTypeContainer}>
          <Text style={styles.labelText}>选择打法</Text>
          <DropdownSelect
            options={challengeTypes}
            selectedValue={selectedChallengeType}
            placeholder="请选择打法"
            onSelect={handleChallengeTypeChange}
            valueKey="value"
            labelKey="label"
            zIndex={4000}
            zIndexInverse={1000}
          />
        </View>

        {selectedChallengeType ? (
          <NewChallengeForm
            challengeType={selectedChallengeType}
            operators={operatorList}
            locations={locationList}
            formData={formData}
            onChange={handleFormChange}
            onConfirm={handleConfirm}
          />
        ) : (
          <View style={styles.instructionContainer}>
            <Icon name="arrow-upward" size={48} color={THEME_COLORS.primary} />
            <Text style={styles.instructionText}>请先选择打法</Text>
            <Text style={styles.instructionSubText}>选择后将显示相应的挑战表单</Text>
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
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
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
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
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
