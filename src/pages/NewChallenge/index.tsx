import React, { useState, useCallback, useEffect } from 'react';
import { Alert, StyleSheet, SafeAreaView, StatusBar, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { THEME_COLORS } from '../../utils/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NewChallengeForm } from './components/NewChallengeForm';
import { getOperatorList, createChallenge, getAddressList } from '../../api/services/gameService';
import { UserResult } from '../../interface/User';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
import { AddressInfo } from '../../interface/Game';
import { formatDate } from '../../utils/date';
import { validateChallengeParams } from './utils/validation';
import { ChallengeFormData } from './interface/IModuleProps';

export const NewChallengeScreen = React.memo(() => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [operatorList, setOperatorList] = useState<UserResult[]>([]);
  const [locationList, setLocationList] = useState<AddressInfo[]>([]);

  // 使用单一状态管理表单数据
  const [formData, setFormData] = useState<ChallengeFormData>({
    operatorCode: '',
    locationId: 0,
    name: '',
    date: new Date(),
    principal: '',
  });

  // 处理表单数据变更
  const handleFormChange = useCallback((newData: Partial<ChallengeFormData>) => {
    setFormData((prevData: ChallengeFormData) => ({
      ...prevData,
      ...newData,
    }));
    console.log('表单数据已更新:', newData);
  }, []);

  // 处理确认按钮点击
  const handleConfirm = useCallback(() => {
    // 新增挑战
    const params = {
      name: formData.name.trim(),
      playPersonCode: formData.operatorCode,
      addressInfoId: formData.locationId,
      gameDate: formData.date ? formatDate(formData.date, 'YYYY-MM-DD') : '',
      principal: parseFloat(formData.principal),
    };

    // 校验参数
    const validation = validateChallengeParams(params);
    if (!validation.isValid) {
      Alert.alert('提示', validation.errorMessage || '表单填写有误');
      return;
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
  }, [formData, navigation]);

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
        <NewChallengeForm
          operators={operatorList}
          locations={locationList}
          formData={formData}
          onChange={handleFormChange}
          onConfirm={handleConfirm}
        />
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
    padding: 20,
    zIndex: 1,
  },
});

export default NewChallengeScreen;
