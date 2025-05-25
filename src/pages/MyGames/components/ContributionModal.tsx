import React, { useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ContributionDto } from '../../../interface/Contribution';
import { THEME_COLORS } from '../../../utils/styles';
import CustomText from '../../../components/CustomText';
import { SlideModal } from '../../../components/SlideModal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '../../../hooks/useTranslation';

interface ContributionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedContribution: ContributionDto[];
  currency?: string;
  loading?: boolean;
}

export const ContributionModal = React.memo((props: ContributionModalProps) => {
  const { visible, onClose, selectedContribution, currency, loading = false } = props;
  const { t } = useTranslation();

  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <CustomText style={styles.loadingText}>{t('myGames.loadingDetails')}</CustomText>
        </View>
      );
    }

    if (!selectedContribution.length) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="info" size={40} color="#ccc" />
          <CustomText style={styles.emptyText}>{t('fundraisingChallenge.noContributionRecords')}</CustomText>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        <CustomText style={styles.contributionTitle}>{t('fundraisingChallenge.contributionDetails')}</CustomText>
        {selectedContribution.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.contributionContent}>
            <CustomText style={styles.contributionName}>{item.investPersonName}</CustomText>
            <CustomText style={styles.contributionAmount}>
              {t('fundraisingChallenge.amount')}: {item.amount}
            </CustomText>
            <CustomText style={styles.contributionAmount}>
              {t('fundraisingChallenge.contriRate')}: {item.contriRateStr}
            </CustomText>
          </View>
        ))}
      </View>
    );
  }, [loading, selectedContribution, t]);

  return (
    <SlideModal
      visible={visible}
      onClose={onClose}
      title={t('fundraisingChallenge.contributionDetails') + `${currency && `(${currency})`}`}
    >
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
    paddingVertical: 8,
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
