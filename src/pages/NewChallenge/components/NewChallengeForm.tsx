import React, { useMemo, useCallback, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CustomText from '../../../components/CustomText';
import CustomTextInput from '../../../components/CustomTextInput';
import DropdownSelect from '../../../components/DropdownSelect';
import NumberInput from '../../../components/NumberInput';
import { DatePicker } from '../../../components/DatePicker';
import { TagNumberInput } from './TagNumberInput';
import { THEME_COLORS } from '../../../utils/styles';
import { BusinessDto } from '../../../interface/Business';
import { AddressInfo } from '../../../interface/Game';
import { validateNumberInput } from '../utils/validation';
import { ChallengeFormData, DropdownType, CURRENCY_OPTIONS } from '../interface/IModuleProps';
import { ChallengeType } from '../../../interface/Common';

interface NewChallengeFormProps {
  challengeType: ChallengeType;
  operators: BusinessDto[];
  locations: AddressInfo[];
  formData: ChallengeFormData;
  onChange: (data: Partial<ChallengeFormData>) => void;
  onConfirm: () => void;
}

export const NewChallengeForm: React.FC<NewChallengeFormProps> = React.memo((props: NewChallengeFormProps) => {
  const { operators, locations, formData, onChange, onConfirm, challengeType } = props;
  // 用于控制当前打开的下拉框
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(DropdownType.NONE);

  // 更新表单字段
  const updateField = useCallback(
    (field: keyof ChallengeFormData, value: any) => {
      onChange({ [field]: value });
    },
    [onChange],
  );

  // 获取投注基数的提示信息
  const getBetAmountHint = useCallback(() => {
    if (challengeType === ChallengeType.EVEN_BET) {
      return '仅支持100的倍数';
    } else if (challengeType === ChallengeType.NO_PROFIT_LIMIT) {
      return '仅支持300的倍数';
    } else if (challengeType === ChallengeType.FREE_FIGHT) {
      return '仅支持100的倍数，可以添加多个投注基数';
    }
    return '';
  }, [challengeType]);

  // 验证表单是否可提交
  const isFormValid = useMemo(() => {
    const hasValidBetAmount =
      challengeType === ChallengeType.FREE_FIGHT
        ? Array.isArray(formData.initialBetAmount) && formData.initialBetAmount.length > 0
        : typeof formData.initialBetAmount === 'number' && formData.initialBetAmount > 0;

    return (
      !!formData.operatorCode &&
      formData.locationId > 0 &&
      !!formData.date &&
      validateNumberInput(formData.principal) > 0 &&
      !!formData.currency &&
      hasValidBetAmount
    );
  }, [formData, challengeType]);

  // 处理投注基数变更
  const handleBetAmountChange = useCallback(
    (value: number | number[]) => {
      updateField('initialBetAmount', value);
    },
    [updateField],
  );

  // 处理单个数字输入（非自由搏击）
  const handleSingleBetAmountChange = useCallback(
    (value: string) => {
      updateField('initialBetAmount', value ? parseFloat(value) || 0 : 0);
    },
    [updateField],
  );

  // 获取单个投注基数显示值
  const getSingleBetAmountValue = useCallback(() => {
    return typeof formData.initialBetAmount === 'number' ? formData.initialBetAmount.toString() : '';
  }, [formData.initialBetAmount]);

  // 获取多个投注基数值
  const getMultipleBetAmountValues = useCallback(() => {
    return Array.isArray(formData.initialBetAmount) ? formData.initialBetAmount : [];
  }, [formData.initialBetAmount]);

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
      <CustomText style={styles.labelText}>投注基数</CustomText>
      {challengeType === ChallengeType.FREE_FIGHT ? (
        <TagNumberInput
          values={getMultipleBetAmountValues()}
          onChange={handleBetAmountChange}
          placeholder="输入数字"
          hint={getBetAmountHint()}
        />
      ) : (
        <NumberInput
          value={getSingleBetAmountValue()}
          onChangeText={handleSingleBetAmountChange}
          placeholder="请输入投注基数"
          hint={getBetAmountHint()}
          keyboardType="numeric"
        />
      )}
      <>
        <CustomText style={styles.labelText}>币种</CustomText>
        <DropdownSelect
          options={CURRENCY_OPTIONS}
          selectedValue={formData.currency}
          placeholder="请选择币种"
          onSelect={(value: any) => updateField('currency', value)}
          valueKey="value"
          labelKey="label"
          isOpen={activeDropdown === DropdownType.CURRENCY}
          onStateChange={(isOpen: any) => handleDropdownStateChange(DropdownType.CURRENCY, isOpen)}
          zIndex={1800}
          zIndexInverse={2200}
          style={{
            selectContainer: {
              marginBottom: 0,
            },
            dropdown: {
              minHeight: 40,
            },
          }}
        />
      </>
      <>
        <CustomText style={styles.labelText}>选择投手</CustomText>
        <DropdownSelect
          options={operators}
          selectedValue={formData.operatorCode}
          placeholder="请选择投手"
          onSelect={(value: any) => updateField('operatorCode', value)}
          valueKey="code"
          labelKey="name"
          isOpen={activeDropdown === DropdownType.PLAYPERSON}
          onStateChange={(isOpen: any) => handleDropdownStateChange(DropdownType.PLAYPERSON, isOpen)}
          zIndex={3000}
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
      </>
      <>
        <CustomText style={styles.labelText}>选择地点</CustomText>
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
          style={{
            selectContainer: {
              marginBottom: 0,
            },
            dropdown: {
              minHeight: 40,
            },
          }}
        />
      </>
      <DatePicker
        title="选择时间"
        selectedDate={formData.date}
        onDateChange={(date) => updateField('date', date)}
        format="YYYY-MM-DD"
        style={{
          labelText: {
            marginTop: 4,
          },
        }}
      />
      <View style={{ marginBottom: 2 }}>
        <CustomText style={styles.labelText}>挑战名称</CustomText>
        <CustomTextInput
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
      {/* <NumberInput
        title="设置出资额(不能大于本金)"
        value={formData.contriAmount}
        onChangeText={(value: any) => updateField('contriAmount', value)}
        placeholder="请输入出资额"
        hint="出资额需要为10000的倍数"
      /> */}
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
        <CustomText style={styles.confirmButtonText}>确认</CustomText>
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
    marginBottom: 2,
    marginTop: 4,
  },
  textInput: {
    height: 40,
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
