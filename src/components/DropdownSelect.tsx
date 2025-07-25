import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTranslation } from '../hooks/useTranslation';
import { mergeStyles } from '../utils/styles';

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
  style?: Partial<Record<keyof typeof styles, ViewStyle | TextStyle>>;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = React.memo((props: DropdownSelectProps) => {
  const { t } = useTranslation();
  const {
    options,
    selectedValue,
    placeholder = t('common.select'),
    onSelect,
    valueKey,
    labelKey,
    keyExtractor,
    isOpen,
    onStateChange,
    zIndex = 1000,
    zIndexInverse = 1000,
    style,
  } = props;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValue);

  // 使用mergeStyles合并样式
  const mergedStyles = useMemo(() => mergeStyles(styles, style), [style]);

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

  // 自定义渲染列表项，确保文字不缩放
  const renderListItem = useCallback(
    ({ item, onPress, isSelected }: any) => (
      <TouchableOpacity
        style={[mergedStyles.optionItem, isSelected && { backgroundColor: '#f0f0f0' }]}
        onPress={() => onPress(item)}
      >
        <Text style={mergedStyles.optionText} allowFontScaling={false}>
          {item.label}
        </Text>
      </TouchableOpacity>
    ),
    [mergedStyles],
  );

  return (
    <View style={[mergedStyles.selectContainer, { zIndex, elevation: zIndex }]}>
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
        style={mergedStyles.dropdown}
        textStyle={mergedStyles.dropdownText}
        listItemLabelStyle={mergedStyles.optionText}
        listItemContainerStyle={mergedStyles.optionItem}
        maxHeight={200}
        scrollViewProps={{
          nestedScrollEnabled: true,
          showsVerticalScrollIndicator: true,
          persistentScrollbar: true,
        }}
        listMode="SCROLLVIEW"
        dropDownContainerStyle={mergedStyles.optionsList}
        listMessageContainerStyle={mergedStyles.emptyContainer}
        listMessageTextStyle={mergedStyles.emptyText}
        translation={{
          NOTHING_TO_SHOW: t('common.noData'),
        }}
        labelProps={{
          allowFontScaling: false,
        }}
        renderListItem={renderListItem}
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
  },
  dropdownText: {
    fontSize: 14,
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
    fontSize: 14,
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
