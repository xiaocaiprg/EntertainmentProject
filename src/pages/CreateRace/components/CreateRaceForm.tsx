import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DatePicker } from '../../../components/DatePicker';
import { useTranslation } from '../../../hooks/useTranslation';
import { FormData } from '../interface/IModuleProps';
import DropdownSelect from '../../../components/DropdownSelect';
import { ChallengeType } from '../../../interface/Common';
import CustomText from '../../../components/CustomText';
import CustomTextInput from '../../../components/CustomTextInput';

interface CreateRaceFormProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
}

// 打法类型选项
const RULE_CODE_OPTIONS = [
  { label: '无止盈过关', value: ChallengeType.NO_PROFIT_LIMIT },
  { label: '平注', value: ChallengeType.EVEN_BET },
];

export const CreateRaceForm = React.memo((props: CreateRaceFormProps) => {
  const { formData, onChange } = props;
  const { t } = useTranslation();

  // 处理开始日期变更
  const handleBeginDateChange = useCallback(
    (date: Date) => {
      onChange({ beginDate: date });
    },
    [onChange],
  );

  // 处理结束日期变更
  const handleEndDateChange = useCallback(
    (date: Date) => {
      onChange({ endDate: date });
    },
    [onChange],
  );

  // 处理打法选择变更
  const handleRuleCodeChange = useCallback(
    (value: string) => {
      onChange({ playRuleCode: value });
    },
    [onChange],
  );

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}
    >
      <View style={styles.formContainer}>
        <View style={styles.formItem}>
          <CustomText style={styles.label}>
            {t('createRace.name')} <CustomText style={{ color: '#F91B00' }}>*</CustomText>
          </CustomText>
          <CustomTextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => onChange({ name: value })}
            placeholder={t('createRace.namePlaceholder')}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formItem}>
          <CustomText style={styles.label}>
            {t('createRace.beginDate')} <CustomText style={{ color: '#F91B00' }}>*</CustomText>
          </CustomText>
          <DatePicker
            selectedDate={formData.beginDate ? formData.beginDate : new Date()}
            onDateChange={handleBeginDateChange}
            placeholder={t('createRace.selectDate')}
            format="YYYY-MM-DD"
            style={{
              datePicker: styles.datePickerButton,
              dateText: styles.dateText,
              labelText: styles.label,
            }}
          />
        </View>

        <View style={styles.formItem}>
          <CustomText style={styles.label}>
            {t('createRace.endDate')} <CustomText style={{ color: '#F91B00' }}>*</CustomText>
          </CustomText>
          <DatePicker
            selectedDate={formData.endDate ? formData.endDate : new Date()}
            onDateChange={handleEndDateChange}
            placeholder={t('createRace.selectDate')}
            format="YYYY-MM-DD"
            style={{
              datePicker: styles.datePickerButton,
              dateText: styles.dateText,
              labelText: styles.label,
            }}
          />
        </View>

        <View style={styles.formItem}>
          <CustomText style={styles.label}>{t('createRace.playRuleCode')}</CustomText>
          <DropdownSelect
            options={RULE_CODE_OPTIONS}
            selectedValue={formData.playRuleCode}
            placeholder={t('createRace.playRuleCodePlaceholder')}
            onSelect={handleRuleCodeChange}
            valueKey="value"
            labelKey="label"
            zIndex={4000}
            zIndexInverse={1000}
            style={{
              selectContainer: {
                marginBottom: 0,
              },
              dropdown: {
                backgroundColor: '#fff',
                minHeight: 40,
              },
            }}
          />
        </View>

        <View style={styles.formItem}>
          <CustomText style={styles.label}>{t('createRace.turnOverLimit')}</CustomText>
          <CustomTextInput
            style={styles.input}
            value={formData.turnOverLimit}
            onChangeText={(value) => onChange({ turnOverLimit: value })}
            placeholder={t('createRace.turnOverLimitPlaceholder')}
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formItem}>
          <CustomText style={styles.label}>{t('createRace.description')}</CustomText>
          <CustomTextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => onChange({ description: value })}
            placeholder={t('createRace.descriptionPlaceholder')}
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    backgroundColor: '#FAF8F7',
  },
  scrollViewContent: {
    flexGrow: 0,
  },
  formContainer: {
    padding: 10,
  },
  formItem: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    paddingTop: 15,
  },
  datePickerButton: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  datePlaceholder: {
    fontSize: 16,
    color: '#999',
  },
});
