import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GameMatchProfitDto } from '../../../interface/Game';
import { THEME_COLORS } from '../../../utils/styles';

interface ProfitModalProps {
  visible: boolean;
  onClose: () => void;
  profit: GameMatchProfitDto;
  loading?: boolean;
}

export const ProfitModal = React.memo((props: ProfitModalProps) => {
  const { visible, onClose, profit, loading = false } = props;

  const renderPersonProfitList = useCallback((profitData: GameMatchProfitDto) => {
    if (!profitData.personProfitDtoList || profitData.personProfitDtoList.length === 0) {
      return null;
    }
    return (
      <>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>投资人利润详情</Text>
        {profitData.personProfitDtoList.map((person, index) => (
          <View key={index} style={styles.profitItem}>
            <Text style={styles.profitLabel}>{person.investPersonName}</Text>
            <Text style={styles.profitValue}>{person.profitStr}</Text>
          </View>
        ))}
      </>
    );
  }, []);

  const modalContent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text style={styles.loadingText}>正在加载详情...</Text>
        </View>
      );
    }

    if (!profit) {
      return (
        <View style={styles.noProfitContainer}>
          <Icon name="info" size={40} color="#ccc" />
          <Text style={styles.noProfitText}>暂无利润分配信息</Text>
        </View>
      );
    }

    return (
      <View style={styles.profitContent}>
        <View style={styles.profitItem}>
          <Text style={styles.profitLabel}>{`记录公司:${profit.docCompanyName}`}</Text>
          <Text style={styles.profitValue}>{profit.docCompanyProfitStr}</Text>
        </View>
        <View style={styles.profitItem}>
          <Text style={styles.profitLabel}>{`投资公司:${profit.investCompanyName}`}</Text>
          <Text style={styles.profitValue}>{profit.investCompanyProfitStr}</Text>
        </View>
        <View style={styles.profitItem}>
          <Text style={styles.profitLabel}>{`运营公司:${profit.operationCompanyName}`}</Text>
          <Text style={styles.profitValue}>{profit.operationCompanyProfitStr}</Text>
        </View>
        <View style={styles.profitItem}>
          <Text style={styles.profitLabel}>{`投手公司:${profit.playCompanyName}`}</Text>
          <Text style={styles.profitValue}>{profit.playCompanyProfitStr}</Text>
        </View>
        {renderPersonProfitList(profit)}
      </View>
    );
  }, [loading, profit, renderPersonProfitList]);

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={{ width: 30 }} />
            <Text style={styles.modalTitle}>利润分配详情</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView nestedScrollEnabled={true}>{modalContent()}</ScrollView>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    minHeight: '40%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  closeButton: {
    padding: 2,
  },
  profitContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  profitLabel: {
    fontSize: 15,
    color: THEME_COLORS.text.secondary,
    flex: 1,
  },
  profitValue: {
    fontSize: 15,
    fontWeight: '500',
    color: THEME_COLORS.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: THEME_COLORS.text.primary,
  },
  noProfitContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noProfitText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: THEME_COLORS.text.secondary,
    marginTop: 15,
  },
});
