import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { STATUS_BAR_HEIGHT, isIOS } from '../../../utils/platform';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import { CreateRaceForm } from './components/CreateRaceForm';
import { createRace } from '../../../api/services/raceService';
import { RootStackScreenProps } from '../../router';
import { validateRaceParams, formDataToParams } from './utils';
import { FormData } from './interface/IModuleProps';
import CustomText from '../../../components/CustomText';

// 使用导航堆栈中定义的类型
type CreateRaceScreenProps = RootStackScreenProps<'CreateRace'>;

const getEndDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return date;
};

export const CreateRaceScreen: React.FC<CreateRaceScreenProps> = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    beginDate: new Date(),
    endDate: getEndDate(),
    playRuleCode: '',
    turnOverLimit: '',
  });

  // 处理表单数据变更
  const handleFormChange = useCallback((newData: Partial<FormData>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  const validation = useMemo(() => validateRaceParams(formData), [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validation.isValid) {
      Alert.alert(t(validation.errorMessage || 'common.error'));
      return;
    }
    setLoading(true);
    try {
      const params = formDataToParams(formData);
      const res = await createRace(params);
      if (res) {
        Alert.alert(t('createRace.createSuccess'));
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }, [formData, navigation, validation, t]);

  // 处理返回按钮点击
  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);
  // 验证表单是否可提交
  const isValid = useMemo(() => {
    return formData.name && !!formData.beginDate && !!formData.endDate;
  }, [formData]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('createRace.title')}</CustomText>
        <View style={styles.placeholder} />
      </View>
      <CreateRaceForm formData={formData} onChange={handleFormChange} />
      <TouchableOpacity
        style={[styles.submitButton, (loading || !isValid) && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading || !isValid}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <CustomText style={styles.submitButtonText}>{t('common.submit')}</CustomText>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
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
  submitButton: {
    height: 50,
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
