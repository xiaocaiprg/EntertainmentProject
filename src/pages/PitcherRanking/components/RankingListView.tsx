import React, { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { THEME_COLORS } from '../../../utils/styles';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomText from '../../../components/CustomText';
import {
  RankingTabType,
  PlayerHitrateRankDto,
  // PlayerKillrateRankDto,
  RankingTypeEnum,
  PlayerCompanyHitrateRankDto,
  // PlayerCompanyKillrateRankDto,
} from '../../../interface/Ranking';
import { HitRateCard } from './HitRateCard';
// import { KillRateCard } from './KillRateCard';
import { CompanyHitRateCard } from './CompanyHitRateCard';
// import { CompanyKillRateCard } from './CompanyKillRateCard';

interface RankingListViewProps {
  loading: boolean;
  currentTab: RankingTabType;
  rankingType: RankingTypeEnum;
  hitRateData: PlayerHitrateRankDto[];
  killRateData: any[]; // 保留但不使用，避免破坏接口
  companyHitRateData: PlayerCompanyHitrateRankDto[];
  companyKillRateData: any[]; // 保留但不使用，避免破坏接口
}

export const RankingListView = React.memo((props: RankingListViewProps) => {
  const { loading, rankingType, hitRateData, companyHitRateData } = props;
  const { t } = useTranslation();

  // 获取当前数据
  const currentData = useMemo(() => {
    if (rankingType === RankingTypeEnum.PERSONAL) {
      // 个人排行榜只显示命中率数据，不区分个人/组合Tab
      return hitRateData;
    } else {
      // 公司排行榜显示命中率数据
      return companyHitRateData;
    }
  }, [hitRateData, rankingType, companyHitRateData]);

  // 渲染空数据状态
  const renderEmpty = useMemo(() => {
    if (loading && !currentData.length) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <CustomText style={styles.emptyText}>{t('common.loading')}</CustomText>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Icon name="error-outline" size={50} color="#ccc" />
        <CustomText style={styles.emptyText}>{t('pitcher_ranking.noData')}</CustomText>
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
        // 个人排行榜只显示命中率卡片
        return (
          <HitRateCard
            key={`hitrate-${(item as PlayerHitrateRankDto).playerCode}-${index}`}
            item={item}
            index={index}
          />
        );
      } else {
        // 公司排行榜显示命中率卡片
        return (
          <CompanyHitRateCard
            key={`company-hitrate-${(item as PlayerCompanyHitrateRankDto).companyCode}-${index}`}
            item={item}
            index={index}
          />
        );
      }
    });
  }, [currentData, rankingType]);

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
