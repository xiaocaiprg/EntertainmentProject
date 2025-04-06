import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ContributionDto } from '../../../interface/Contribution';
import { THEME_COLORS } from '../../../utils/styles';

interface ContributionListProps {
  contributions: ContributionDto[] | undefined;
}

export const ContributionList: React.FC<ContributionListProps> = React.memo((props) => {
  const { contributions } = props;

  if (!contributions || contributions.length === 0) {
    return (
      <View style={styles.emptyContributionCard}>
        <Text style={styles.detailCardTitle}>出资信息</Text>
        <Text style={styles.emptyText}>暂无出资记录</Text>
      </View>
    );
  }

  return (
    <View style={styles.contributionCard}>
      <Text style={styles.detailCardTitle}>出资信息</Text>
      <FlatList
        data={contributions}
        keyExtractor={(item, index) => `contribution-${item.id || index}`}
        renderItem={({ item }) => (
          <View style={styles.contributionItem}>
            <View style={styles.contributionHeader}>
              <Text style={styles.contributionName} numberOfLines={1} ellipsizeMode="tail">
                {item.investPersonName}
              </Text>
              <Text style={styles.contributionAmount}>{item.amount || '-'}</Text>
            </View>
          </View>
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  detailCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
    marginBottom: 10,
  },
  contributionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 12,
    paddingBottom: 0,
    marginBottom: 12,
  },
  emptyContributionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  contributionItem: {
    paddingVertical: 8,
  },
  contributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  contributionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  contributionAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME_COLORS.primary,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});
