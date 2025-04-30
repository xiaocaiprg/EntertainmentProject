import React, { useCallback, useMemo } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../hooks/useTranslation';

interface InfoModalProps {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export const InfoModal = React.memo((props: InfoModalProps) => {
  const { visible, title, content, onClose } = props;
  const { t } = useTranslation();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderContent = useMemo(() => {
    return (
      <ScrollView style={styles.contentScroll}>
        <Text style={styles.contentText}>{content}</Text>
      </ScrollView>
    );
  }, [content]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {renderContent}
          <TouchableOpacity style={styles.confirmButton} onPress={handleClose}>
            <Text style={styles.confirmText}>{t('common.confirm')}</Text>
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
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    maxHeight: '80%',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
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
    marginVertical: 15,
    maxHeight: 300,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#2089dc',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default InfoModal;
