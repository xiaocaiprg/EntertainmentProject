import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTranslation } from '../hooks/useTranslation';
import { mergeStyles } from '../utils/styles';

interface MultiSelectDropdownProps {
  options: any[];
  selectedValues: any[];
  onSelectionChange: (values: any[]) => void;
  placeholder?: string;
  valueKey: string;
  labelKey: string;
  keyExtractor?: (item: any) => string;
  isOpen?: boolean;
  onStateChange?: (isOpen: boolean) => void;
  zIndex?: number;
  zIndexInverse?: number;
  style?: Partial<Record<keyof typeof styles, ViewStyle | TextStyle>>;
  maxHeight?: number;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = React.memo((props) => {
  const { t } = useTranslation();
  const {
    options,
    selectedValues,
    onSelectionChange,
    placeholder = '请选择',
    valueKey,
    labelKey,
    keyExtractor,
    isOpen,
    onStateChange,
    zIndex = 1000,
    zIndexInverse = 1000,
    style,
    maxHeight = 200,
  } = props;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedValues);

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
      onSelectionChange(val || []);
    },
    [onSelectionChange],
  );

  return (
    <View style={[mergedStyles.selectContainer, { zIndex, elevation: zIndex }]}>
      <DropDownPicker
        multiple={true}
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
        maxHeight={maxHeight}
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
        itemKey="value"
        dropDownDirection={'BOTTOM'}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        mode="BADGE"
        badgeDotColors={['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96']}
        badgeColors={['#1890ff20', '#52c41a20', '#faad1420', '#f522d220', '#722ed120', '#eb2f9620']}
        badgeTextStyle={mergedStyles.badgeText}
        badgeStyle={mergedStyles.badge}
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
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    minHeight: 44,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    flexWrap: 'wrap',
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    color: '#333',
  },
});

export default MultiSelectDropdown;
