import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface DropdownSelectProps {
  title: string;
  options: any[];
  placeholder?: string;
  valueKey: string;
  labelKey: string;
  selectedValue: any;
  onSelect: (value: any) => void;
  keyExtractor?: (item: any) => string;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = React.memo((props: DropdownSelectProps) => {
  const { title, options, selectedValue, placeholder = '请选择', onSelect, valueKey, labelKey, keyExtractor } = props;
  const [showOptions, setShowOptions] = useState(false);

  const getOptionValue = useCallback(
    (option: any) => {
      if (keyExtractor) {
        return keyExtractor(option);
      }
      return option[valueKey];
    },
    [keyExtractor, valueKey],
  );

  const selectedOption = useMemo(
    () => options.find((option) => getOptionValue(option) === selectedValue),
    [options, selectedValue, getOptionValue],
  );

  const handleSelect = useCallback(
    (value: any) => {
      onSelect(value);
      setShowOptions(false);
    },
    [onSelect],
  );

  const toggleOptions = useCallback(() => {
    setShowOptions((prev) => !prev);
  }, []);

  return (
    <View style={styles.selectContainer}>
      <Text style={styles.labelText}>{title}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={toggleOptions}>
        <Text style={styles.dropdownText}>{selectedOption ? selectedOption[labelKey] : placeholder}</Text>
        <Icon name={showOptions ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} color="#666" />
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
          <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
            {options.map((option) => (
              <TouchableOpacity
                key={getOptionValue(option)}
                style={styles.optionItem}
                onPress={() => handleSelect(getOptionValue(option))}
              >
                <Text style={styles.optionText}>{option[labelKey]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  selectContainer: {
    marginBottom: 10,
    position: 'relative',
    zIndex: 10,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  optionsContainer: {
    // position: 'absolute',
    // top: 76,
    // left: 0,
    // right: 0,
    zIndex: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  optionsList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    maxHeight: 200,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default DropdownSelect;
