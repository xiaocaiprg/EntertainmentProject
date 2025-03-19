import React, { useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

interface GameOverModalProps {
  visible: boolean;
  onConfirm: () => void;
  confirmText?: string;
}

export const GameOverModal: React.FC<GameOverModalProps> = React.memo((props) => {
  const { visible, onConfirm, confirmText = '返回首页' } = props;

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleConfirm}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>游戏结束</Text>
          <Text style={styles.modalMessage}>本次游戏已结束，感谢您的参与！</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.fullWidthButton} onPress={handleConfirm}>
              <Text style={styles.confirmModalButtonText}>{confirmText}</Text>
            </TouchableOpacity>
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
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
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
    width: '100%',
  },
  fullWidthButton: {
    paddingVertical: 12,
    backgroundColor: '#6c5ce7',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  confirmModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
