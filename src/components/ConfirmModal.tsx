import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from '../hooks/useTranslation';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  isProcessing?: boolean;
  customContent?: React.ReactNode;
}

export const ConfirmModal = React.memo((props: ConfirmModalProps) => {
  const { t } = useTranslation();
  const {
    visible,
    title,
    message,
    cancelText = t('common.cancel'),
    confirmText = t('common.confirm'),
    onCancel,
    onConfirm,
    isProcessing = false,
    customContent,
  } = props;

  // 处理背景点击，阻止事件冒泡
  const handleModalPress = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={handleModalPress}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{title}</Text>
              </View>
              <View style={styles.modalBody}>
                <Text style={styles.modalMessage}>{message}</Text>
                {customContent && <View style={styles.customContent}>{customContent}</View>}
              </View>
              <View style={styles.modalFooter}>
                {onCancel && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, isProcessing && styles.disabledButton]}
                    onPress={onCancel}
                    disabled={isProcessing}
                  >
                    <Text style={[styles.cancelButtonText, isProcessing && styles.disabledText]}>{cancelText}</Text>
                  </TouchableOpacity>
                )}
                {onConfirm && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton, isProcessing && styles.disabledButton]}
                    onPress={onConfirm}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={[styles.confirmButtonText, isProcessing && styles.disabledText]}>{confirmText}</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 5,
  },
  customContent: {
    marginTop: 10,
    width: '100%',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f6fa',
    borderWidth: 1,
    borderColor: '#dfe4ea',
  },
  confirmButton: {
    backgroundColor: '#6c5ce7',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 15,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default ConfirmModal;
