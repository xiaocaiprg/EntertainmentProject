import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CustomText from '../../../components/CustomText';
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

  const hasContributions = useMemo(() => {
    return Boolean(matchDetail?.contributionDtoList && matchDetail.contributionDtoList.length > 0);
  }, [matchDetail?.contributionDtoList]);

  if (!matchDetail) {
    return null;
  }
  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>募资信息</CustomText>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <CustomText style={styles.label}>本金</CustomText>
          <CustomText style={styles.value}>{matchDetail.principal || '-'}</CustomText>
        </View>
        <View style={styles.infoItem}>
          <CustomText style={styles.label}>已募资金额</CustomText>
          <CustomText style={styles.valueHighlight}>{matchDetail.contributedAmount || '0'}</CustomText>
        </View>
        <View style={styles.infoItem}>
          <CustomText style={styles.label}>可募资金额</CustomText>
          <CustomText style={styles.valueAvailable}>{matchDetail.availableAmount || '0'}</CustomText>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View>
        <CustomText style={styles.progressText}>{percentage}%</CustomText>
      </View>

      {hasContributions && (
        <View>
          <CustomText style={styles.contributionTitle}>出资明细</CustomText>
          <View style={styles.listContainer}>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
              {matchDetail.contributionDtoList?.map((item, index) => (
                <View key={`${item.id}-${index}`} style={styles.contributionItem}>
                  <CustomText style={styles.contributionName}>出资人: {item.investPersonName}</CustomText>
                  <CustomText style={styles.contributionAmount}>金额: {item.amount}</CustomText>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
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
    marginBottom: 4,
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
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  listContainer: {
    height: 150,
  },
  contributionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
