import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, TextInput, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import CustomText from './CustomText';
import { mergeStyles } from '../utils/styles';

interface NumberInputProps {
  title?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'numeric' | 'decimal-pad';
  errorMessage?: string;
  hint?: string;
  style?: Partial<Record<keyof typeof styles, ViewStyle | TextStyle>>;
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
    style,
  } = props;

  // 使用mergeStyles合并样式
  const mergedStyles = useMemo(() => mergeStyles(styles, style), [style]);

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
    <View style={mergedStyles.container}>
      {title && <CustomText style={mergedStyles.labelText}>{title}</CustomText>}
      <TextInput
        style={[mergedStyles.input, errorMessage && mergedStyles.inputError]}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
      />
      {hint ? <CustomText style={mergedStyles.hintText}>{hint}</CustomText> : null}
      {errorMessage ? <CustomText style={mergedStyles.errorText}>{errorMessage}</CustomText> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {},
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 4,
    marginBottom: 2,
  },
  input: {
    height: 40,
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
