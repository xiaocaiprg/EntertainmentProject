import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

interface NumberInputProps {
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'numeric' | 'decimal-pad';
  errorMessage?: string;
}

export const NumberInput: React.FC<NumberInputProps> = React.memo((props: NumberInputProps) => {
  const { title, value, onChangeText, placeholder = '请输入', keyboardType = 'decimal-pad', errorMessage } = props;

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
      <Text style={styles.labelText}>{title}</Text>
      <TextInput
        style={[styles.input, errorMessage && styles.inputError]}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
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
});

export default NumberInput;
