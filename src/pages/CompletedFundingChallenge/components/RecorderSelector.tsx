import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { THEME_COLORS } from '../../../utils/styles';
import { UserResult } from '../../../interface/User';

interface RecorderSelectorProps {
  visible: boolean;
  recorderList: UserResult[];
  selectedRecorder: UserResult | null;
  submitting: boolean;
  onClose: () => void;
  onSelect: (recorder: UserResult) => void;
  onSubmit: () => void;
}

export const RecorderSelector = React.memo((props: RecorderSelectorProps) => {
  const { visible, recorderList, selectedRecorder, submitting, onClose, onSelect, onSubmit } = props;

  // 选择记录人
  const handleSelectRecorder = useCallback(
    (recorder: UserResult) => {
      onSelect(recorder);
    },
    [onSelect],
  );

  // 渲染记录人列表项
  const renderRecorderItem = useCallback(
    ({ item }: { item: UserResult }) => {
      const isSelected = selectedRecorder?.id === item.id;
      return (
        <TouchableOpacity
          style={[styles.recorderItem, isSelected && styles.selectedRecorderItem]}
          onPress={() => handleSelectRecorder(item)}
        >
          <Text style={[styles.recorderName, isSelected && styles.selectedRecorderName]}>{item.name || '未命名'}</Text>
          {isSelected && <Icon name="check" size={20} color={THEME_COLORS.primary} />}
        </TouchableOpacity>
      );
    },
    [selectedRecorder, handleSelectRecorder],
  );

  // 记录人选择Modal内容
  const modalContent = useMemo(() => {
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>选择记录人</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={THEME_COLORS.text.primary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={recorderList}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderRecorderItem}
            contentContainerStyle={styles.recorderList}
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={submitting}>
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, (!selectedRecorder || submitting) && styles.disabledButton]}
              onPress={onSubmit}
              disabled={!selectedRecorder || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>确认</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [recorderList, selectedRecorder, submitting, onClose, onSubmit, renderRecorderItem]);

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      {modalContent}
    </Modal>
  );
});

const styles = StyleSheet.create({
  // Modal样式
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  recorderList: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  recorderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedRecorderItem: {
    backgroundColor: THEME_COLORS.primary + '10',
  },
  recorderName: {
    fontSize: 16,
    color: '#333',
  },
  selectedRecorderName: {
    color: THEME_COLORS.primary,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 4,
    marginLeft: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});
