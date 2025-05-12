import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTranslation } from '../hooks/useTranslation';
import { mergeStyles } from '../utils/styles';

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
  style?: Partial<Record<keyof typeof styles, ViewStyle | TextStyle>>;
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
    style,
  } = props;

  // 使用mergeStyles合并样式
  const mergedStyles = useMemo(() => mergeStyles(styles, style), [style]);

  // 处理背景点击，阻止事件冒泡
  const handleModalPress = useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={mergedStyles.modalContainer}>
          <TouchableWithoutFeedback onPress={handleModalPress}>
            <View style={mergedStyles.modalContent}>
              <View style={mergedStyles.modalHeader}>
                <Text style={mergedStyles.modalTitle}>{title}</Text>
              </View>
              <View style={mergedStyles.modalBody}>
                <Text style={mergedStyles.modalMessage}>{message}</Text>
                {customContent && <View style={mergedStyles.customContent}>{customContent}</View>}
              </View>
              <View style={mergedStyles.modalFooter}>
                {onCancel && (
                  <TouchableOpacity
                    style={[
                      mergedStyles.modalButton,
                      mergedStyles.cancelButton,
                      isProcessing && mergedStyles.disabledButton,
                    ]}
                    onPress={onCancel}
                    disabled={isProcessing}
                  >
                    <Text style={[mergedStyles.cancelButtonText, isProcessing && mergedStyles.disabledText]}>
                      {cancelText}
                    </Text>
                  </TouchableOpacity>
                )}
                {onConfirm && (
                  <TouchableOpacity
                    style={[
                      mergedStyles.modalButton,
                      mergedStyles.confirmButton,
                      isProcessing && mergedStyles.disabledButton,
                    ]}
                    onPress={onConfirm}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={[mergedStyles.confirmButtonText, isProcessing && mergedStyles.disabledText]}>
                        {confirmText}
                      </Text>
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
