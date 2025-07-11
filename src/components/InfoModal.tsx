import React, { useCallback, useMemo, ReactNode } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from './CustomText';
import { useTranslation } from '../hooks/useTranslation';

interface InfoModalProps {
  visible: boolean;
  title: string;
  content?: string;
  customContent?: ReactNode;
  onClose: () => void;
}

export const InfoModal = React.memo((props: InfoModalProps) => {
  const { visible, title, content, customContent, onClose } = props;
  const { t } = useTranslation();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderContent = useMemo(() => {
    if (customContent) {
      return <ScrollView style={styles.contentScroll}>{customContent}</ScrollView>;
    }
    return (
      <ScrollView style={styles.contentScroll}>
        <CustomText style={styles.contentText}>{content}</CustomText>
      </ScrollView>
    );
  }, [content, customContent]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={{ width: 20 }} />
            <CustomText style={styles.title}>{title}</CustomText>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {renderContent}
          <TouchableOpacity style={styles.confirmButton} onPress={handleClose}>
            <CustomText style={styles.confirmText}>{t('common.confirm')}</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    maxHeight: '80%',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  contentScroll: {
    marginVertical: 10,
    maxHeight: 300,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#6D5CE7',
    borderRadius: 5,
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default InfoModal;
