import React, { useMemo, useCallback, useState } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DropdownSelect from '../../../components/DropdownSelect';
import NumberInput from '../../../components/NumberInput';
import { DatePicker } from '../../../components/DatePicker';
import { THEME_COLORS } from '../../../utils/styles';
import { UserResult } from '../../../interface/User';
import { AddressInfo } from '../../../interface/Game';
import { validateNumberInput } from '../utils/validation';
import { ChallengeFormData, DropdownType } from '../interface/IModuleProps';

interface NewChallengeFormProps {
  operators: UserResult[];
  locations: AddressInfo[];
  formData: ChallengeFormData;
  onChange: (data: Partial<ChallengeFormData>) => void;
  onConfirm: () => void;
}

export const NewChallengeForm: React.FC<NewChallengeFormProps> = React.memo((props: NewChallengeFormProps) => {
  const { operators, locations, formData, onChange, onConfirm } = props;
  // 用于控制当前打开的下拉框
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(DropdownType.NONE);

  // 更新表单字段
  const updateField = useCallback(
    (field: keyof ChallengeFormData, value: any) => {
      onChange({ [field]: value });
    },
    [onChange],
  );

  // 验证表单是否可提交
  const isFormValid = useMemo(() => {
    return (
      !!formData.operatorCode &&
      formData.locationId > 0 &&
      !!formData.date &&
      validateNumberInput(formData.principal) > 0 &&
      validateNumberInput(formData.contriAmount) >= 0
    );
  }, [formData]);

  // 处理下拉框状态变化
  const handleDropdownStateChange = useCallback(
    (type: DropdownType, isOpen: boolean) => {
      if (isOpen) {
        setActiveDropdown(type);
      } else if (activeDropdown === type) {
        setActiveDropdown(DropdownType.NONE);
      }
    },
    [activeDropdown],
  );

  return (
    <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
      <>
        <Text style={styles.labelText}>选择投手</Text>
        <DropdownSelect
          options={operators}
          selectedValue={formData.operatorCode}
          placeholder="请选择投手"
          onSelect={(value: any) => updateField('operatorCode', value)}
          valueKey="code"
          labelKey="name"
          isOpen={activeDropdown === DropdownType.OPERATOR}
          onStateChange={(isOpen: any) => handleDropdownStateChange(DropdownType.OPERATOR, isOpen)}
          zIndex={3000}
          zIndexInverse={1000}
        />
      </>
      <>
        <Text style={styles.labelText}>选择地点</Text>
        <DropdownSelect
          options={locations}
          selectedValue={formData.locationId}
          placeholder="请选择地点"
          onSelect={(value: any) => updateField('locationId', value)}
          valueKey="id"
          labelKey="name"
          isOpen={activeDropdown === DropdownType.LOCATION}
          onStateChange={(isOpen: any) => handleDropdownStateChange(DropdownType.LOCATION, isOpen)}
          zIndex={2000}
          zIndexInverse={2000}
        />
      </>
      <DatePicker
        title="选择时间"
        selectedDate={formData.date}
        onDateChange={(date) => updateField('date', date)}
        format="YYYY-MM-DD"
        style={{
          container: { marginBottom: 10 },
        }}
      />
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.labelText}>挑战名称</Text>
        <TextInput
          style={styles.textInput}
          value={formData.name}
          onChangeText={(text) => updateField('name', text)}
          placeholder="请输入本次挑战名称"
          placeholderTextColor="#999"
        />
      </View>
      <NumberInput
        title="设置本金"
        value={formData.principal}
        onChangeText={(value: any) => updateField('principal', value)}
        placeholder="请输入本金金额"
        hint="本金需要为10000的倍数"
      />
      <NumberInput
        title="设置出资额(不能大于本金)"
        value={formData.contriAmount}
        onChangeText={(value: any) => updateField('contriAmount', value)}
        placeholder="请输入出资额"
        hint="出资额需要为10000的倍数"
      />
      {/*
      <NumberInput
        title="设置止损额"
        value={formData.lossLimit}
        onChangeText={(value: any) => updateField('lossLimit', value)}
        placeholder="请输入止损额"
      /> */}
      <View style={styles.spacer} />
      <TouchableOpacity
        style={[styles.confirmButton, !isFormValid && styles.confirmButtonDisabled]}
        onPress={onConfirm}
        disabled={!isFormValid}
      >
        <Text style={styles.confirmButtonText}>确认</Text>
      </TouchableOpacity>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  spacer: {
    height: 10,
  },
  confirmButton: {
    backgroundColor: THEME_COLORS.primary,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
