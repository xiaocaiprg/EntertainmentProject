import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameMatchDto } from '../../../interface/Game';
import { THEME_COLORS } from '../../../utils/styles';

interface FundraisingInfoProps {
  matchDetail: GameMatchDto | null;
}

export const FundraisingInfo: React.FC<FundraisingInfoProps> = React.memo((props) => {
  const { matchDetail } = props;

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
      <Text style={styles.title}>募资信息</Text>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>本金额度</Text>
          <Text style={styles.value}>{matchDetail.principal || '-'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>已募资金额</Text>
          <Text style={styles.valueHighlight}>{matchDetail.contributedAmount || '0'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>可募资金额</Text>
          <Text style={styles.valueAvailable}>{matchDetail.availableAmount || '0'}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.progressText}>{percentage}%</Text>
      </View>

      {matchDetail.contributionDtoList && matchDetail.contributionDtoList.length > 0 ? (
        <View style={styles.contributionList}>
          <Text style={styles.contributionTitle}>出资明细</Text>
          {matchDetail.contributionDtoList.map((contribution, index) => (
            <View key={`contribution-${contribution.id || index}`} style={styles.contributionItem}>
              <View style={styles.contributionContent}>
                <Text style={styles.contributionName}>出资人: {contribution.investPersonName}</Text>
                <Text style={styles.contributionAmount}>金额: {contribution.amount}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 15,
    marginBottom: 15,
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
  contributionList: {
    marginTop: 10,
  },
  contributionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 6,
  },
  contributionItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
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
});
