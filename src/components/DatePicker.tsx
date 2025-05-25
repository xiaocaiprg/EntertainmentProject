import React, { useCallback, useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ViewStyle, TextStyle } from 'react-native';
import { formatDate } from '../utils/date';
import { isAndroid, isIOS } from '../utils/platform';
import CustomText from './CustomText';
import { mergeStyles } from '../utils/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from '../hooks/useTranslation';

interface DatePickerProps {
  title?: string;
  placeholder?: string;
  format?: string;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  style?: Partial<Record<keyof typeof styles, ViewStyle | TextStyle>>;
}

export const DatePicker: React.FC<DatePickerProps> = React.memo((props: DatePickerProps) => {
  const { t } = useTranslation();
  const {
    title,
    selectedDate,
    onDateChange,
    placeholder = t('common.selectDate'),
    format = 'YYYY-MM-DD',
    style,
  } = props;
  const [showPicker, setShowPicker] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date>(selectedDate);

  // 使用mergeStyles合并样式
  const mergedStyles = useMemo(() => mergeStyles(styles, style), [style]);

  // 打开日期选择器
  const handleOpenPicker = useCallback(() => {
    setShowPicker(true);
    setTempSelectedDate(selectedDate);
  }, [selectedDate]);

  // 处理日期变更
  const handleDateChange = useCallback(
    (event: any, date?: Date) => {
      if (isAndroid()) {
        setShowPicker(false);
        if (date && event.type !== 'dismissed') {
          onDateChange(date);
        }
      } else {
        if (date) {
          setTempSelectedDate(date);
        }
      }
    },
    [onDateChange],
  );

  // iOS取消按钮
  const handleCancel = useCallback(() => {
    setShowPicker(false);
  }, []);

  // iOS确认按钮
  const handleConfirm = useCallback(() => {
    setShowPicker(false);
    onDateChange(tempSelectedDate);
  }, [onDateChange, tempSelectedDate]);

  const formattedDate = useMemo(() => {
    if (selectedDate instanceof Date) {
      return formatDate(selectedDate, format);
    }
    return placeholder;
  }, [selectedDate, format, placeholder]);

  return (
    <View style={mergedStyles.container}>
      {title && <CustomText style={mergedStyles.labelText}>{title}</CustomText>}
      <TouchableOpacity style={mergedStyles.datePicker} onPress={handleOpenPicker}>
        <CustomText style={mergedStyles.dateText}>{formattedDate}</CustomText>
      </TouchableOpacity>

      {isAndroid() && showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          minimumDate={new Date(2024, 0, 1)}
          maximumDate={new Date(2030, 11, 31)}
        />
      )}

      {isIOS() && showPicker && (
        <Modal transparent={true} animationType="fade" visible={showPicker} supportedOrientations={['portrait']}>
          <View style={mergedStyles.modalContainer}>
            <View style={mergedStyles.modalContent}>
              <View style={mergedStyles.buttonContainer}>
                <TouchableOpacity onPress={handleCancel} style={mergedStyles.button}>
                  <CustomText style={mergedStyles.buttonTextCancel}>{t('common.cancel')}</CustomText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm} style={mergedStyles.button}>
                  <CustomText style={mergedStyles.buttonTextConfirm}>{t('common.confirm')}</CustomText>
                </TouchableOpacity>
              </View>
              <View style={mergedStyles.datePickerWrapper}>
                <DateTimePicker
                  style={mergedStyles.iosDatePicker}
                  value={tempSelectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  locale="zh-CN"
                  minimumDate={new Date(2024, 0, 1)}
                  maximumDate={new Date(2030, 11, 31)}
                  themeVariant="light"
                  textColor="#000000"
                  accentColor="#007AFF"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  button: {
    padding: 8,
  },
  buttonTextCancel: {
    fontSize: 16,
    color: '#666',
  },
  buttonTextConfirm: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  datePickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 215,
  },
  iosDatePicker: {
    width: '100%',
    height: 215,
  },
});
