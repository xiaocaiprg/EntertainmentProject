import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ContributionDto } from '../../../interface/Contribution';
import { THEME_COLORS } from '../../../utils/styles';
import { GameMatchDto } from '../../../interface/Game';
import { useTranslation } from '../../../hooks/useTranslation';

interface ContributionListProps {
  contributions: ContributionDto[] | undefined;
  matchDetail: GameMatchDto | null;
}

export const ContributionList: React.FC<ContributionListProps> = React.memo((props) => {
  const { contributions, matchDetail } = props;
  const { t } = useTranslation();

  const percentage = useMemo(() => {
    const contributedAmount = matchDetail?.contributedAmount || 0;
    const principal = matchDetail?.principal || 0;
    return principal > 0 ? Math.floor((contributedAmount / principal) * 100) : 0;
  }, [matchDetail]);

  if (!matchDetail) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('fundraisingChallenge.fundraisingInfo')}</Text>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>{t('fundraisingChallenge.principal')}</Text>
          <Text style={styles.value}>{matchDetail.principal || '-'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>{t('fundraisingChallenge.raisedAmount')}</Text>
          <Text style={styles.valueHighlight}>{matchDetail.contributedAmount || '0'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>{t('fundraisingChallenge.availableAmount')}</Text>
          <Text style={styles.valueAvailable}>{matchDetail.availableAmount || '0'}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.progressText}>{percentage}%</Text>
      </View>
      {contributions && contributions.length > 0 ? (
        <View>
          <Text style={styles.contributionTitle}>{t('fundraisingChallenge.contributionDetails')}</Text>
          <View style={styles.listContainer}>
            <FlatList
              data={contributions}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item }) => (
                <View style={styles.contributionContent}>
                  <Text style={styles.contributionName}>
                    {t('fundraisingChallenge.contributor')}: {item.investPersonName}
                  </Text>
                  <Text style={styles.contributionAmount}>
                    {t('fundraisingChallenge.amount')}: {item.amount}
                  </Text>
                </View>
              )}
              style={styles.flatList}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            />
          </View>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('fundraisingChallenge.noContributionRecords')}</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  valueHighlight: {
    fontSize: 16,
    color: THEME_COLORS.primary,
    fontWeight: '600',
  },
  valueAvailable: {
    fontSize: 16,
    color: THEME_COLORS.success,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME_COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: THEME_COLORS.primary,
    fontWeight: '500',
    width: 40,
  },
  contributionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  listContainer: {
    height: 120, // 固定高度
  },
  flatList: {
    backgroundColor: '#fff',
  },
  flatListContent: {
    padding: 4,
  },
  contributionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});
