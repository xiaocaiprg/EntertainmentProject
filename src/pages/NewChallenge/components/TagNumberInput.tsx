import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import CustomText from '../../../components/CustomText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { THEME_COLORS } from '../../../utils/styles';

interface TagNumberInputProps {
  values: number[];
  onChange: (values: number[]) => void;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
}

export const TagNumberInput: React.FC<TagNumberInputProps> = React.memo((props) => {
  const { values, onChange, placeholder, hint, errorMessage } = props;
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  // 添加新标签
  const handleAddTag = useCallback(() => {
    const number = parseFloat(inputValue.trim());
    if (!isNaN(number) && number > 0 && !values.includes(number)) {
      onChange([...values, number]);
      setInputValue('');
      setShowInput(false);
    }
  }, [inputValue, values, onChange]);

  // 删除标签
  const handleRemoveTag = useCallback(
    (index: number) => {
      const newValues = values.filter((_, i) => i !== index);
      onChange(newValues);
    },
    [values, onChange],
  );

  // 显示输入框
  const handleShowInput = useCallback(() => {
    setShowInput(true);
  }, []);

  // 取消输入
  const handleCancelInput = useCallback(() => {
    setInputValue('');
    setShowInput(false);
  }, []);

  // 处理键盘确认
  const handleSubmitEditing = useCallback(() => {
    handleAddTag();
  }, [handleAddTag]);

  // 处理失去焦点（点击空白区域）
  const handleBlur = useCallback(() => {
    if (inputValue.trim()) {
      handleAddTag();
    } else {
      handleCancelInput();
    }
  }, [inputValue, handleAddTag, handleCancelInput]);

  return (
    <View>
      <View style={styles.tagsContentContainer}>
        {values.map((value, index) => (
          <View key={index} style={styles.tag}>
            <CustomText style={styles.tagText}>{value}</CustomText>
            <TouchableOpacity style={styles.tagCloseButton} onPress={() => handleRemoveTag(index)}>
              <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}

        {showInput ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={placeholder || '输入数字'}
              keyboardType="numeric"
              autoFocus
              onSubmitEditing={handleSubmitEditing}
              onBlur={handleBlur}
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={handleShowInput}>
            <Icon name="add" size={16} color={THEME_COLORS.primary} />
            <CustomText style={styles.addButtonText}>添加</CustomText>
          </TouchableOpacity>
        )}
      </View>

      {hint && <CustomText style={styles.hint}>{hint}</CustomText>}

      {errorMessage && <CustomText style={styles.error}>{errorMessage}</CustomText>}
    </View>
  );
});

const styles = StyleSheet.create({
  tagsContentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderRadius: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginRight: 4,
    marginVertical: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 2,
  },
  tagCloseButton: {
    padding: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4ff',
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: THEME_COLORS.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: THEME_COLORS.primary,
    fontSize: 14,
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: THEME_COLORS.primary,
  },
  input: {
    fontSize: 14,
    color: '#333',
    minWidth: 80,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  error: {
    fontSize: 12,
    color: '#ff4757',
    marginTop: 4,
  },
});
