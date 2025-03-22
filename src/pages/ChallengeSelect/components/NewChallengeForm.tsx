import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import DropdownSelect from './DropdownSelect';
import { THEME_COLORS } from '../../../utils/styles';
import { UserRecorder } from '../../../interface/Game';

interface NewChallengeFormProps {
  operators: UserRecorder[];
  selectedOperatorId: string;
  challengeName: string;
  onSelectOperatorId: (userId: string) => void;
  onChangeName: (text: string) => void;
  onConfirm: () => void;
}

export const NewChallengeForm: React.FC<NewChallengeFormProps> = React.memo((props: NewChallengeFormProps) => {
  const { operators, selectedOperatorId, challengeName, onSelectOperatorId, onChangeName, onConfirm } = props;

  const isConfirmDisabled = useMemo(() => !selectedOperatorId, [selectedOperatorId]);

  // 渲染挑战名称输入框
  const renderChallengeNameInput = useCallback(() => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>挑战名称</Text>
        <TextInput
          style={styles.textInput}
          value={challengeName}
          onChangeText={onChangeName}
          placeholder="请输入本次挑战名称"
          placeholderTextColor="#999"
        />
      </View>
    );
  }, [challengeName, onChangeName]);

  return (
    <View style={styles.formContainer}>
      <DropdownSelect
        title="选择投手"
        options={operators}
        selectedValue={selectedOperatorId}
        placeholder="请选择投手"
        onSelect={onSelectOperatorId}
        valueKey="userId"
        labelKey="username"
      />

      {renderChallengeNameInput()}

      <View style={styles.spacer} />

      <TouchableOpacity
        style={[styles.confirmButton, isConfirmDisabled && styles.confirmButtonDisabled]}
        onPress={onConfirm}
        disabled={isConfirmDisabled}
      >
        <Text style={styles.confirmButtonText}>确认</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
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
    height: 20,
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

export default NewChallengeForm;
