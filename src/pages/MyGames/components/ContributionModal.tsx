import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ContributionDto } from '../../../interface/Contribution';
import { THEME_COLORS } from '../../../utils/styles';
import { SlideModal } from '../../../components/SlideModal';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ContributionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedContribution: ContributionDto[];
  loading?: boolean;
}

export const ContributionModal = React.memo((props: ContributionModalProps) => {
  const { visible, onClose, selectedContribution, loading = false } = props;

  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text style={styles.loadingText}>正在加载出资信息...</Text>
        </View>
      );
    }

    if (!selectedContribution.length) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="info" size={40} color="#ccc" />
          <Text style={styles.emptyText}>暂无出资信息</Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.contributionTitle}>出资明细</Text>
        {selectedContribution.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.contributionContent}>
            <Text style={styles.contributionName}>出资人: {item.investPersonName}</Text>
            <Text style={styles.contributionAmount}>金额: {item.amount}</Text>
          </View>
        ))}
      </View>
    );
  }, [loading, selectedContribution]);

  return (
    <SlideModal visible={visible} onClose={onClose} title="挑战出资详情">
      {renderContent()}
    </SlideModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  contributionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    marginBottom: 10,
    marginTop: 5,
  },
  contributionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    marginBottom: 2,
  },
  contributionAmount: {
    color: THEME_COLORS.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  contributionName: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default ContributionModal;
