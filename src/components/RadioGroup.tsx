import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import { THEME_COLORS } from '../utils/styles';

interface RadioOption {
  label: string;
  value: any;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: any;
  onSelect: (value: any) => void;
  style?: any;
}

export const RadioGroup: React.FC<RadioGroupProps> = React.memo((props) => {
  const { options, selectedValue, onSelect, style } = props;

  const handleSelect = useCallback(
    (value: any) => {
      onSelect(value);
    },
    [onSelect],
  );

  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <TouchableOpacity key={option.value} style={styles.radioItem} onPress={() => handleSelect(option.value)}>
            <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
            <CustomText style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>{option.label}</CustomText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: THEME_COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME_COLORS.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  radioLabelSelected: {
    color: THEME_COLORS.primary,
    fontWeight: '500',
  },
});

export default RadioGroup;
