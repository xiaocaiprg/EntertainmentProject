import React, { useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import DropdownSelect from './DropdownSelect';
import { THEME_COLORS } from '../../../utils/styles';
import { GameMatchDto } from '../../../interface/Game';

interface ExistingChallengeFormProps {
  challenges: GameMatchDto[];
  selectedChallengeId: string;
  onSelectChallengeId: (id: string) => void;
  onConfirm: () => void;
}

export const ExistingChallengeForm: React.FC<ExistingChallengeFormProps> = React.memo(
  (props: ExistingChallengeFormProps) => {
    const { challenges, selectedChallengeId, onSelectChallengeId, onConfirm } = props;

    const isConfirmDisabled = useMemo(() => !selectedChallengeId, [selectedChallengeId]);

    return (
      <View style={styles.formContainer}>
        <DropdownSelect
          title="选择挑战"
          options={challenges}
          selectedValue={selectedChallengeId}
          placeholder="请选择挑战"
          onSelect={onSelectChallengeId}
          valueKey="id"
          labelKey="name"
        />

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
  },
);

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

export default ExistingChallengeForm;
