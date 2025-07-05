import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity, Text } from 'react-native';
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

  // 随机颜色配置
  const badgeColors = useMemo(() => ['#1890ff20', '#52c41a20', '#faad1420', '#f522d220', '#722ed120', '#eb2f9620'], []);
  const badgeDotColors = useMemo(() => ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96'], []);

  // 获取字符串的简单哈希值，用于颜色选择
  const getColorIndex = useCallback(
    (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // 转换为32位整数
      }
      return Math.abs(hash) % badgeColors.length;
    },
    [badgeColors.length],
  );

  // 简单自定义Badge项，支持随机颜色，确保文字不缩放
  const renderBadgeItem = useCallback(
    ({ label, value, onPress }: any) => {
      // 使用 value 或 label 来确定颜色索引
      const colorKey = String(value || label || '');
      const colorIndex = getColorIndex(colorKey);

      // 获取对应的颜色
      const backgroundColor = badgeColors[colorIndex];
      const dotColor = badgeDotColors[colorIndex];

      return (
        <TouchableOpacity style={[mergedStyles.badge, { backgroundColor }]} onPress={() => onPress && onPress()}>
          {/* 可选的圆点装饰 */}
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: dotColor,
              marginRight: 4,
            }}
          />
          <Text style={mergedStyles.badgeText} allowFontScaling={false}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    },
    [mergedStyles, getColorIndex, badgeColors, badgeDotColors],
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
        renderListItem={renderListItem}
        renderBadgeItem={renderBadgeItem}
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
        labelProps={{
          allowFontScaling: false,
        }}
        itemKey="value"
        dropDownDirection={'BOTTOM'}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        mode="BADGE"
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
    fontSize: 14,
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
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#333',
  },
});

export default MultiSelectDropdown;
