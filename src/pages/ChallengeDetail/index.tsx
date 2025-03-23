import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMatchDetail } from '../../api/services/gameService';
import { GameMatchDto, GameRoundDto } from '../../interface/Game';
import { STATUS_BAR_HEIGHT, isIOS } from '../../utils/platform';
import { RoundItem } from './components/RoundItem';

export const ChallengeDetail = React.memo(() => {
  const navigation = useNavigation();
  const route = useRoute();
  const { matchId } = route.params as { matchId: number };
  const [loading, setLoading] = useState<boolean>(true);
  const [matchDetail, setMatchDetail] = useState<GameMatchDto | null>(null);

  const fetchMatchDetail = useCallback(async () => {
    setLoading(true);
    const res = await getMatchDetail(matchId);
    setLoading(false);
    res && setMatchDetail(res);
  }, [matchId]);

  useEffect(() => {
    fetchMatchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderRound = useCallback((round: GameRoundDto, index: number) => {
    return <RoundItem key={`round-${round.id || index}`} round={round} index={index} />;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>挑战详情</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : matchDetail ? (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.matchInfoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoColumn}>
                <View style={styles.itemRow}>
                  <Text style={styles.label}>挑战名称:</Text>
                  <Text style={styles.value}>{matchDetail.name || '-'}</Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.label}>投手名字:</Text>
                  <Text style={styles.value}>{matchDetail.playPersonName || '-'}</Text>
                </View>
              </View>
              <View style={styles.infoColumn}>
                <View style={styles.itemRow}>
                  <Text style={styles.label}>上下水:</Text>
                  <Text style={styles.value}>{matchDetail.profitStr || '-'}</Text>
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.label}>转码:</Text>
                  <Text style={styles.value}>{matchDetail.turnOverStr || '-'}</Text>
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.sectionTitle}>场次信息</Text>
          <View style={styles.roundsContainer}>{matchDetail.roundList?.map(renderRound)}</View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无挑战详情</Text>
        </View>
      )}
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
    height: 44,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 36,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  matchInfoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 2,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'column',
  },
  infoColumn: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 70,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  roundsContainer: {
    marginBottom: 16,
  },
});

export default ChallengeDetail;
