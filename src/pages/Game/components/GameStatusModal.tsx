import React, { useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { GameStatusModalInfo } from '../types';

interface GameStatusModalProps {
  modalInfo: GameStatusModalInfo;
  onConfirm: () => void;
  navigation?: any;
}

export const GameStatusModal: React.FC<GameStatusModalProps> = React.memo((props) => {
  const { modalInfo, onConfirm, navigation } = props;
  const { visible, title, confirmText, isGameOver, nextRoundInfo } = modalInfo;

  const handleConfirm = useCallback(() => {
    // 如果是游戏结束状态，则返回首页
    if (isGameOver && navigation) {
      navigation.goBack();
    } else {
      // 否则调用onConfirm关闭弹窗
      onConfirm();
    }
  }, [onConfirm, isGameOver, navigation]);

  // 根据状态渲染不同的内容
  const renderContent = () => {
    if (isGameOver) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.modalMessage}>游戏已结束！</Text>
        </View>
      );
    } else if (nextRoundInfo) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.modalMessage}>
            第{nextRoundInfo.currentRound}轮结束，即将进入第{nextRoundInfo.nextRound}轮
          </Text>
          <Text style={styles.betAmountText}>
            下一轮押注金额：<Text style={styles.highlightText}>{nextRoundInfo.nextBetAmount}</Text> 元
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleConfirm}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          {renderContent()}
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  messageContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 24,
  },
  betAmountText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
  },
  highlightText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  },
});
