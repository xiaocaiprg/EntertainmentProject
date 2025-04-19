import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMatchDetail } from '../../api/services/gameService';
import { removeLastInning } from '../../api/services/roundService';
import { GameMatchDto, GameRoundDto } from '../../interface/Game';
import { THEME_COLORS } from '../../utils/styles';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useTranslation } from '../../hooks/useTranslation';
import { RootStackScreenProps } from '../router';
import { RoundItem } from './components/RoundItem';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
// 使用导航堆栈中定义的类型
type RoundDetailScreenProps = RootStackScreenProps<'RoundDetail'>;

export const RoundDetailScreen: React.FC<RoundDetailScreenProps> = React.memo(({ navigation, route }) => {
  const { t } = useTranslation();
  const { matchId } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [matchDetail, setMatchDetail] = useState<GameMatchDto | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const fetchMatchDetail = useCallback(async () => {
    if (!matchId) {
      return;
    }
    setLoading(true);
    const detailData = await getMatchDetail(matchId);
    if (detailData) {
      setMatchDetail(detailData);
    }
    setLoading(false);
  }, [matchId]);

  useEffect(() => {
    fetchMatchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 返回按钮处理
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // 显示确认弹窗
  const showRestartConfirm = useCallback((roundId: number) => {
    setSelectedRoundId(roundId);
    setConfirmModalVisible(true);
  }, []);

  // 关闭确认弹窗
  const handleCancelRestart = useCallback(() => {
    setConfirmModalVisible(false);
    setSelectedRoundId(null);
  }, []);

  // 确认重启场次
  const handleConfirmRestart = useCallback(async () => {
    if (!selectedRoundId) {
      return;
    }
    setProcessing(true);
    try {
      await removeLastInning(selectedRoundId);
      setConfirmModalVisible(false);
      fetchMatchDetail(); // 重新获取数据
    } catch (error) {
      setConfirmModalVisible(false);
      const errorMessage = error instanceof Error ? error.message : t('roundDetail.restartRoundFailed');
      Alert.alert(t('common.error'), errorMessage, [{ text: t('common.ok'), style: 'cancel' }], { cancelable: true });
      console.log('重启场次失败:', error);
    }
    setProcessing(false);
  }, [selectedRoundId, fetchMatchDetail, t]);

  const renderRoundItem = useCallback(
    ({ item, index }: { item: GameRoundDto; index: number }) => {
      return <RoundItem item={item} index={index} onRestartConfirm={showRestartConfirm} onRefresh={fetchMatchDetail} />;
    },
    [showRestartConfirm, fetchMatchDetail],
  );

  // 渲染内容区域
  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      );
    }

    if (!matchDetail?.roundList?.length) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('roundDetail.noRounds')}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={matchDetail.roundList}
        renderItem={renderRoundItem}
        keyExtractor={(item) => `round_${item.id}`}
        contentContainerStyle={styles.listContent}
      />
    );
  }, [loading, matchDetail, renderRoundItem, t]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={THEME_COLORS.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('roundDetail.title')}</Text>
        <View style={styles.headerRight} />
      </View>

      {renderContent()}

      <ConfirmModal
        visible={confirmModalVisible}
        title={t('roundDetail.restartRoundTitle')}
        message={t('roundDetail.restartRoundConfirmation')}
        onCancel={handleCancelRestart}
        onConfirm={handleConfirmRestart}
        isProcessing={processing}
      />
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
    height: 50,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLORS.text.primary,
  },
  headerRight: {
    width: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: THEME_COLORS.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: THEME_COLORS.text.light,
  },
  listContent: {
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
});
