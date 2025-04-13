import React, { useCallback, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { formatDate } from '../utils/date';
import { isAndroid, isIOS } from '../utils/platform';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
  title: string;
  placeholder?: string;
  format?: string;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = React.memo((props: DatePickerProps) => {
  const { title, selectedDate, onDateChange, placeholder = '请选择日期', format = 'YYYY-MM-DD' } = props;
  const [showPicker, setShowPicker] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date>(selectedDate);

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
    <View style={styles.container}>
      <Text style={styles.labelText}>{title}</Text>
      <TouchableOpacity style={styles.datePicker} onPress={handleOpenPicker}>
        <Text style={styles.dateText}>{formattedDate}</Text>
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
        <Modal transparent={true} animationType="slide" visible={showPicker} supportedOrientations={['portrait']}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleCancel} style={styles.button}>
                  <Text style={styles.buttonTextCancel}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm} style={styles.button}>
                  <Text style={styles.buttonTextConfirm}>确定</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerWrapper}>
                <DateTimePicker
                  style={styles.iosDatePicker}
                  value={tempSelectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  locale="zh-CN"
                  minimumDate={new Date(2024, 0, 1)}
                  maximumDate={new Date(2030, 11, 31)}
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
    marginBottom: 16,
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
    padding: 12,
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
    padding: 16,
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
