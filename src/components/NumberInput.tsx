import React, { useCallback } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import CustomText from './CustomText';

interface NumberInputProps {
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'numeric' | 'decimal-pad';
  errorMessage?: string;
  hint?: string;
}

export const NumberInput: React.FC<NumberInputProps> = React.memo((props: NumberInputProps) => {
  const { t } = useTranslation();
  const {
    title,
    value,
    onChangeText,
    placeholder = t('common.inputNumber'),
    keyboardType = 'decimal-pad',
    errorMessage,
    hint,
  } = props;

  const handleChangeText = useCallback(
    (text: string) => {
      // 只允许输入数字和小数点
      const newText = text.replace(/[^0-9.]/g, '');
      // 确保只有一个小数点
      const parts = newText.split('.');
      if (parts.length > 2) {
        return;
      }
      onChangeText(newText);
    },
    [onChangeText],
  );

  return (
    <View style={styles.container}>
      <CustomText style={styles.labelText}>{title}</CustomText>

      <TextInput
        style={[styles.input, errorMessage && styles.inputError]}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
      />
      {hint ? <CustomText style={styles.hintText}>{hint}</CustomText> : null}
      {errorMessage ? <CustomText style={styles.errorText}>{errorMessage}</CustomText> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    fontSize: 12,
    color: '#ff3b30',
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default NumberInput;
