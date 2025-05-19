import React from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface DownloadProgressModalProps {
  visible: boolean;
  progress: number;
}

const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({ visible, progress, onClose }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.title}>正在下载更新</Text>
          <View style={styles.progressWrapper}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{`${progress}%`}</Text>
          <ActivityIndicator size="small" color="#0066cc" style={styles.activityIndicator} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  progressContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  progressWrapper: {
    width: '100%',
    height: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0066cc',
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  activityIndicator: {
    marginTop: 10,
  },
});

export default DownloadProgressModal;
