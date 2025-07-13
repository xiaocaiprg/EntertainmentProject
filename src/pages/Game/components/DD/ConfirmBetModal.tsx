import React, { useCallback } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { BetChoice, BetChoiceMap } from '../../types/common';
import CustomText from '../../../../components/CustomText';

interface ConfirmBetModalProps {
  visible: boolean;
  title: string;
  currentChoice: BetChoice | undefined;
  selectedBetAmount: number;
  onCancel?: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText: string;
  showCancelButton?: boolean;
  isFullWidthButton?: boolean;
  isSubmitting?: boolean;
  message?: string;
}

export const ConfirmBetModal: React.FC<ConfirmBetModalProps> = React.memo((props) => {
  const {
    visible,
    title,
    currentChoice,
    selectedBetAmount,
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

  // 检查是否可以确认（必须从下拉框选择了有效的投注金额且选择了下注结果）
  const canConfirm = selectedBetAmount && selectedBetAmount > 0 && currentChoice;

  // 获取弹窗显示消息
  const getModalMessage = useCallback(() => {
    // 检查是否选择了投注金额
    if (!selectedBetAmount || selectedBetAmount <= 0) {
      return <CustomText style={[styles.modalMessage, { color: '#EB1D04' }]}>请先选择投注金额</CustomText>;
    }

    if (!currentChoice) {
      if (message) {
        return <CustomText style={[styles.modalMessage, { color: '#EB1D04' }]}>{message}</CustomText>;
      }
      return <CustomText style={styles.modalMessage}>未知错误</CustomText>;
    }
    return (
      <View style={styles.messageContainer}>
        <View style={styles.amountContainer}>
          <CustomText style={styles.amountLabel}>投注金额</CustomText>
          <CustomText style={styles.amountValue}>{Number(selectedBetAmount) || 0}</CustomText>
        </View>
        <CustomText style={styles.modalMessage}>
          您选择了
          <CustomText style={currentChoice?.includes('banker') ? styles.bankerText : styles.playerText}>
            {BetChoiceMap[currentChoice]}
          </CustomText>
          ，确认提交吗？
        </CustomText>
      </View>
    );
  }, [currentChoice, selectedBetAmount, message]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <CustomText style={styles.modalTitle}>{title}</CustomText>
          {getModalMessage()}
          <View style={styles.modalButtons}>
            {isFullWidthButton ? (
              <TouchableOpacity
                style={[styles.fullWidthButton, (!canConfirm || isSubmitting) && styles.disabledButton]}
                onPress={handleConfirm}
                disabled={!canConfirm || isSubmitting}
              >
                <CustomText
                  style={[styles.confirmModalButtonText, (!canConfirm || isSubmitting) && styles.disabledText]}
                >
                  {confirmText}
                </CustomText>
              </TouchableOpacity>
            ) : (
              <>
                {showCancelButton && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton, isSubmitting && styles.disabledButton]}
                    onPress={handleCancel}
                    disabled={isSubmitting}
                  >
                    <CustomText style={[styles.cancelButtonText, isSubmitting && styles.disabledText]}>
                      {cancelText}
                    </CustomText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.confirmModalButton,
                    (!canConfirm || isSubmitting) && styles.disabledButton,
                  ]}
                  onPress={handleConfirm}
                  disabled={!canConfirm || isSubmitting}
                >
                  <CustomText
                    style={[styles.confirmModalButtonText, (!canConfirm || isSubmitting) && styles.disabledText]}
                  >
                    {confirmText}
                  </CustomText>
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
  messageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
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
