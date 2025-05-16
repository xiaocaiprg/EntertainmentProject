import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { RootStackScreenProps } from '../router';
import { THEME_COLORS } from '../../utils/styles';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getRecordPeak } from '../../api/services/rankService';
import { PeakRecordDto, GameMatchSimpleDto } from '../../interface/Ranking';
import { useTranslation } from '../../hooks/useTranslation';
import CustomText from '../../components/CustomText';
import LinearGradient from 'react-native-linear-gradient';

export const PeakRecordScreen: React.FC<RootStackScreenProps<'PeakRecord'>> = React.memo((props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [recordData, setRecordData] = useState<PeakRecordDto | null>(null);

  // 获取峰值记录数据
  const fetchPeakRecord = useCallback(async () => {
    setLoading(true);
    const result = await getRecordPeak();
    if (result) {
      setRecordData(result);
    }
    setLoading(false);
  }, []);

  // 初始化加载数据
  useEffect(() => {
    fetchPeakRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 渲染记录卡片
  const renderRecordCard = useCallback(
    (data: GameMatchSimpleDto, type: 'profit' | 'count') => {
      if (!data) {
        return null;
      }

      const gradientColors =
        type === 'profit'
          ? ['#4776E6', '#8E54E9'] // 上下水卡片渐变蓝紫色
          : ['#2193b0', '#6dd5ed']; // 把数卡片渐变青蓝色

      // 卡片标题
      const cardTitle = type === 'profit' ? t('peakRecord.profit') : t('peakRecord.count');
      // 卡片值
      const cardValue = type === 'profit' ? data.profitStr : String(data.count);

      return (
        <View style={styles.cardOuterContainer}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardGradient}
          >
            {/* 卡片标题和值 */}
            <View style={styles.cardHeader}>
              <CustomText style={styles.cardTitle}>{cardTitle}</CustomText>
              <CustomText style={styles.cardValue}>{cardValue}</CustomText>
            </View>

            {/* 卡片内容 */}
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <CustomText style={styles.infoLabel}>{t('peakRecord.gameName')}:</CustomText>
                <CustomText style={styles.infoValue} numberOfLines={1}>
                  {data.name || '--'}
                </CustomText>
              </View>

              <View style={styles.infoRow}>
                <CustomText style={styles.infoLabel}>{t('peakRecord.gameDate')}:</CustomText>
                <CustomText style={styles.infoValue}>{data.gameDate || '--'}</CustomText>
              </View>

              <View style={styles.infoRow}>
                <CustomText style={styles.infoLabel}>{t('peakRecord.location')}:</CustomText>
                <CustomText style={styles.infoValue} numberOfLines={1}>
                  {data.addressName || '--'}
                </CustomText>
              </View>

              <View style={styles.infoRow}>
                <CustomText style={styles.infoLabel}>{t('peakRecord.playRule')}:</CustomText>
                <CustomText style={styles.infoValue}>{data.playRuleName || '--'}</CustomText>
              </View>

              <View style={styles.infoRow}>
                <CustomText style={styles.infoLabel}>{t('peakRecord.pitcher')}:</CustomText>
                <CustomText style={styles.infoValue}>{data.playPersonName || '--'}</CustomText>
              </View>

              <View style={styles.infoRow}>
                <CustomText style={styles.infoLabel}>{t('peakRecord.turnOver')}:</CustomText>
                <CustomText style={styles.infoValue}>{data.turnOverStr || '--'}</CustomText>
              </View>
            </View>
          </LinearGradient>
        </View>
      );
    },
    [t],
  );

  // 渲染内容
  const renderContent = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <CustomText style={styles.loadingText}>{t('common.loading')}</CustomText>
        </View>
      );
    }

    if (!recordData) {
      return (
        <View style={styles.centerContainer}>
          <Icon name="inbox" size={48} color="#999" />
          <CustomText style={styles.noDataText}>{t('common.noData')}</CustomText>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {renderRecordCard(recordData.maxProfitMatch, 'profit')}
        {renderRecordCard(recordData.maxInningCountMatch, 'count')}
      </ScrollView>
    );
  }, [loading, recordData, renderRecordCard, t]);

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>{t('peakRecord.title')}</CustomText>
        <View style={styles.headerRight} />
      </View>

      {/* 内容区域 */}
      <View style={styles.container}>{renderContent}</View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.border.light,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
  },
  headerRight: {
    width: 36,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 10,
  },
  cardOuterContainer: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  cardContent: {
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#fff',
    width: 80,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
});
