import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface DropdownSelectProps {
  options: any[];
  placeholder?: string;
  valueKey: string;
  labelKey: string;
  selectedValue: any;
  onSelect: (value: any) => void;
  keyExtractor?: (item: any) => string;
  isOpen?: boolean;
  onStateChange?: (isOpen: boolean) => void;
  zIndex?: number;
  zIndexInverse?: number;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = React.memo((props: DropdownSelectProps) => {
  const {
    options,
    selectedValue,
    placeholder = '请选择',
    onSelect,
    valueKey,
    labelKey,
    keyExtractor,
    isOpen,
    onStateChange,
    zIndex = 1000,
    zIndexInverse = 1000,
  } = props;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue);

  // 使用外部状态控制本地状态
  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  const getOptionValue = useCallback(
    (option: any) => {
      if (keyExtractor) {
        return keyExtractor(option);
      }
      return option[valueKey];
    },
    [keyExtractor, valueKey],
  );

  const itemsData = useMemo(() => {
    return options.map((option) => ({
      label: option[labelKey],
      value: getOptionValue(option),
    }));
  }, [options, labelKey, getOptionValue]);

  const handleValueChange = useCallback(
    (val: any) => {
      setValue(val);
      onSelect(val);
    },
    [onSelect],
  );

  return (
    <View style={[styles.selectContainer, { zIndex, elevation: zIndex }]}>
      <DropDownPicker
        open={open}
        value={value}
        items={itemsData}
        setOpen={(isOpened) => {
          setOpen(isOpened);
          if (onStateChange) {
            onStateChange(!!isOpened);
          }
        }}
        setValue={setValue}
        onChangeValue={handleValueChange}
        placeholder={placeholder}
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        listItemLabelStyle={styles.optionText}
        listItemContainerStyle={styles.optionItem}
        maxHeight={200}
        scrollViewProps={{
          nestedScrollEnabled: true,
          showsVerticalScrollIndicator: true,
          persistentScrollbar: true,
        }}
        listMode="SCROLLVIEW"
        dropDownContainerStyle={styles.optionsList}
        listMessageContainerStyle={styles.emptyContainer}
        listMessageTextStyle={styles.emptyText}
        translation={{
          NOTHING_TO_SHOW: '暂无数据',
        }}
        itemKey="value"
        dropDownDirection={'BOTTOM'}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  selectContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  dropdown: {
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
  optionsList: {
    position: 'relative',
    top: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
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
  emptyContainer: {
    padding: 15,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default DropdownSelect;
