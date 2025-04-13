import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GameMatchProfitDto } from '../../../interface/Game';
import { THEME_COLORS } from '../../../utils/styles';
import { SlideModal } from '../../../components/SlideModal';

interface ProfitModalProps {
  visible: boolean;
  onClose: () => void;
  profit: GameMatchProfitDto;
  loading?: boolean;
}

export const ProfitModal = React.memo((props: ProfitModalProps) => {
  const { visible, onClose, profit, loading = false } = props;

  const renderPersonMyGames = useCallback((profitData: GameMatchProfitDto) => {
    if (!profitData.personProfitDtoList || profitData.personProfitDtoList.length === 0) {
      return null;
    }
    return (
      <>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>投资公司利润详情</Text>
        {profitData.personProfitDtoList.map((person, index) => (
          <View key={index} style={styles.profitItem}>
            <Text style={styles.profitLabel}>{person.investPersonName}</Text>
            <Text style={styles.profitValue}>{person.profitStr}</Text>
          </View>
        ))}
      </>
    );
  }, []);

  const renderContent = useCallback(() => {
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
        {renderPersonMyGames(profit)}
      </View>
    );
  }, [loading, profit, renderPersonMyGames]);

  return (
    <SlideModal visible={visible} onClose={onClose} title="利润分配详情">
      {renderContent()}
    </SlideModal>
  );
});

const styles = StyleSheet.create({
  profitContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  profitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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

export default ProfitModal;
