import React, { useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { BetChoice, BetChoiceMap } from '../../types/common';

interface GameModalProps {
  visible: boolean;
  title: string;
  currentChoice: BetChoice | undefined;
  onCancel?: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText: string;
  showCancelButton?: boolean;
  isFullWidthButton?: boolean;
  isSubmitting?: boolean;
  message?: string;
}

export const GameModal: React.FC<GameModalProps> = React.memo((props) => {
  const {
    visible,
    title,
    currentChoice,
    onCancel,
    onConfirm,
    cancelText = '取消',
    confirmText,
    showCancelButton = true,
    isFullWidthButton = false,
    isSubmitting = false,
    message,
  } = props;
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  // 获取弹窗显示消息
  const getModalMessage = useCallback(() => {
    if (!currentChoice) {
      if (message) {
        return <Text style={[styles.modalMessage, { color: '#EB1D04' }]}>{message}</Text>;
      }
      return <Text style={styles.modalMessage}>未知错误</Text>;
    }
    return (
      <Text style={styles.modalMessage}>
        您选择了<Text style={styles.bankerText}>{BetChoiceMap[currentChoice]}</Text>，确认提交吗？
      </Text>
    );
  }, [currentChoice, message]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {getModalMessage()}
          <View style={styles.modalButtons}>
            {isFullWidthButton ? (
              <TouchableOpacity
                style={[styles.fullWidthButton, isSubmitting && styles.disabledButton]}
                onPress={handleConfirm}
                disabled={isSubmitting}
              >
                <Text style={[styles.confirmModalButtonText, isSubmitting && styles.disabledText]}>{confirmText}</Text>
              </TouchableOpacity>
            ) : (
              <>
                {showCancelButton && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, isSubmitting && styles.disabledButton]}
                    onPress={handleCancel}
                    disabled={isSubmitting}
                  >
                    <Text style={[styles.cancelButtonText, isSubmitting && styles.disabledText]}>{cancelText}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmModalButton, isSubmitting && styles.disabledButton]}
                  onPress={handleConfirm}
                  disabled={isSubmitting}
                >
                  <Text style={[styles.confirmModalButtonText, isSubmitting && styles.disabledText]}>
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  modalButtons: {
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
  fullWidthButton: {
    paddingVertical: 12,
    backgroundColor: '#6c5ce7',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f6fa',
    borderWidth: 1,
    borderColor: '#dfe4ea',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 15,
  },
  confirmModalButton: {
    backgroundColor: '#6c5ce7',
  },
  confirmModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  playerText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#3498db',
  },
  bankerText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
