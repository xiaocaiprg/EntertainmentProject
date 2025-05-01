import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import {
  RankingTabType,
  PlayerHitrateRankDto,
  PlayerKillrateRankDto,
  RankingTypeEnum,
  PlayerCompanyHitrateRankDto,
  PlayerCompanyKillrateRankDto,
} from '../../../interface/Ranking';
import { HitRateCard } from './HitRateCard';
import { KillRateCard } from './KillRateCard';
import { CompanyHitRateCard } from './CompanyHitRateCard';
import { CompanyKillRateCard } from './CompanyKillRateCard';

interface RankingListViewProps {
  loading: boolean;
  currentTab: RankingTabType;
  rankingType: RankingTypeEnum;
  hitRateData: PlayerHitrateRankDto[];
  killRateData: PlayerKillrateRankDto[];
  companyHitRateData: PlayerCompanyHitrateRankDto[];
  companyKillRateData: PlayerCompanyKillrateRankDto[];
}

export const RankingListView = React.memo((props: RankingListViewProps) => {
  const { loading, currentTab, rankingType, hitRateData, killRateData, companyHitRateData, companyKillRateData } =
    props;
  const { t } = useTranslation();

  // 获取当前数据
  const currentData = useMemo(() => {
    if (rankingType === RankingTypeEnum.PERSONAL) {
      return currentTab === RankingTabType.HIT_RATE ? hitRateData : killRateData;
    } else {
      return currentTab === RankingTabType.HIT_RATE ? companyHitRateData : companyKillRateData;
    }
  }, [currentTab, hitRateData, killRateData, rankingType, companyHitRateData, companyKillRateData]);

  // 渲染空数据状态
  const renderEmpty = useMemo(() => {
    if (loading && !currentData.length) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text style={styles.emptyText}>{t('common.loading')}</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Icon name="error-outline" size={50} color="#ccc" />
        <Text style={styles.emptyText}>{t('pitcher_ranking.noData')}</Text>
      </View>
    );
  }, [loading, t, currentData.length]);

  // 渲染加载更多的底部组件
  const renderFooter = useMemo(() => {
    if (!loading || !currentData.length) {
      return null;
    }
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={THEME_COLORS.primary} />
      </View>
    );
  }, [loading, currentData.length]);

  // 渲染列表内容
  const renderItems = useMemo(() => {
    return currentData.map((item, index) => {
      if (rankingType === RankingTypeEnum.PERSONAL) {
        if (currentTab === RankingTabType.HIT_RATE) {
          return (
            <HitRateCard
              key={`hitrate-${(item as PlayerHitrateRankDto).playerCode}-${index}`}
              item={item}
              index={index}
            />
          );
        } else {
          return (
            <KillRateCard
              key={`killrate-${(item as PlayerKillrateRankDto).playerCode}-${index}`}
              item={item}
              index={index}
            />
          );
        }
      } else {
        if (currentTab === RankingTabType.HIT_RATE) {
          return (
            <CompanyHitRateCard
              key={`company-hitrate-${(item as PlayerCompanyHitrateRankDto).companyCode}-${index}`}
              item={item}
              index={index}
            />
          );
        } else {
          return (
            <CompanyKillRateCard
              key={`company-killrate-${(item as PlayerCompanyKillrateRankDto).companyCode}-${index}`}
              item={item}
              index={index}
            />
          );
        }
      }
    });
  }, [currentData, rankingType, currentTab]);

  if (!currentData.length) {
    return renderEmpty;
  }

  return (
    <View style={styles.container}>
      <View style={styles.listContent}>
        {renderItems}
        {renderFooter}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
  },
  loadingFooter: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default RankingListView;
