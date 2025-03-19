import React, { useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface GameModalProps {
  visible: boolean;
  title: string;
  message: React.ReactNode;
  onCancel?: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText: string;
  showCancelButton?: boolean;
  isFullWidthButton?: boolean;
}

export const GameModal: React.FC<GameModalProps> = React.memo(
  ({
    visible,
    title,
    message,
    onCancel,
    onConfirm,
    cancelText = '取消',
    confirmText,
    showCancelButton = true,
    isFullWidthButton = false,
  }) => {
    const handleCancel = useCallback(() => {
      if (onCancel) {
        onCancel();
      }
    }, [onCancel]);

    const handleConfirm = useCallback(() => {
      onConfirm();
    }, [onConfirm]);

    return (
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleCancel}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            {typeof message === 'string' ? <Text style={styles.modalMessage}>{message}</Text> : message}
            <View style={styles.modalButtons}>
              {isFullWidthButton ? (
                <TouchableOpacity style={styles.fullWidthButton} onPress={handleConfirm}>
                  <Text style={styles.confirmModalButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              ) : (
                <>
                  {showCancelButton && (
                    <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                      <Text style={styles.cancelButtonText}>{cancelText}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={[styles.modalButton, styles.confirmModalButton]} onPress={handleConfirm}>
                    <Text style={styles.confirmModalButtonText}>{confirmText}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  fullWidthButton: {
    paddingVertical: 12,
    backgroundColor: '#6c5ce7',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  confirmModalButton: {
    backgroundColor: '#6c5ce7',
  },
  confirmModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
