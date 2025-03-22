import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';

interface Tournament {
  id: number;
  title: string;
  status: string;
  participants: number;
  prize: string;
  endTime: string;
  image: string;
}

interface LeaderboardPlayer {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

export const TournamentScreen = React.memo(() => {
  // 赛事数据
  const tournaments = useMemo<Tournament[]>(
    () => [
      {
        id: 1,
        title: '每周挑战赛',
        status: '进行中',
        participants: 128,
        prize: '10000积分',
        endTime: '3天后结束',
        image: 'https://via.placeholder.com/100x100/6c5ce7/ffffff?text=Weekly',
      },
      {
        id: 2,
        title: '月度锦标赛',
        status: '即将开始',
        participants: 256,
        prize: '50000积分',
        endTime: '2天后开始',
        image: 'https://via.placeholder.com/100x100/6c5ce7/ffffff?text=Monthly',
      },
      {
        id: 3,
        title: '年度大师赛',
        status: '报名中',
        participants: 512,
        prize: '100000积分',
        endTime: '15天后开始',
        image: 'https://via.placeholder.com/100x100/6c5ce7/ffffff?text=Annual',
      },
    ],
    [],
  );

  // 排行榜数据
  const leaderboard = useMemo<LeaderboardPlayer[]>(
    () => [
      { rank: 1, name: '玩家1', score: 9800, avatar: 'https://via.placeholder.com/50x50/6c5ce7/ffffff?text=1' },
      { rank: 2, name: '玩家2', score: 9500, avatar: 'https://via.placeholder.com/50x50/6c5ce7/ffffff?text=2' },
      { rank: 3, name: '玩家3', score: 9200, avatar: 'https://via.placeholder.com/50x50/6c5ce7/ffffff?text=3' },
      { rank: 4, name: '玩家4', score: 8900, avatar: 'https://via.placeholder.com/50x50/6c5ce7/ffffff?text=4' },
      { rank: 5, name: '玩家5', score: 8700, avatar: 'https://via.placeholder.com/50x50/6c5ce7/ffffff?text=5' },
    ],
    [],
  );

  // 渲染赛事卡片
  const renderTournamentItem = (tournament: Tournament) => (
    <TouchableOpacity key={tournament.id} style={styles.tournamentCard}>
      <Image source={{ uri: tournament.image }} style={styles.tournamentImage} />
      <View style={styles.tournamentInfo}>
        <Text style={styles.tournamentTitle}>{tournament.title}</Text>
        <View style={styles.tournamentMeta}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tournament.status) }]}>
            <Text style={styles.statusText}>{tournament.status}</Text>
          </View>
          <Text style={styles.tournamentDetail}>{tournament.endTime}</Text>
        </View>
        <View style={styles.tournamentStats}>
          <Text style={styles.tournamentDetail}>
            <Icon name="people" size={14} color="#666" /> {tournament.participants}人参与
          </Text>
          <Text style={styles.tournamentDetail}>
            <Icon name="card-giftcard" size={14} color="#666" /> {tournament.prize}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 根据状态获取颜色
  const getStatusColor = (status: string): string => {
    switch (status) {
      case '进行中':
        return '#6c5ce7';
      case '即将开始':
        return '#00b894';
      case '报名中':
        return '#fdcb6e';
      default:
        return '#95a5a6';
    }
  };

  // 渲染排行榜项目
  const renderLeaderboardItem = (player: LeaderboardPlayer, index: number) => (
    <View key={player.rank} style={styles.leaderboardItem}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText, index < 3 ? styles.topRank : null]}>{player.rank}</Text>
      </View>
      <Image source={{ uri: player.avatar }} style={styles.playerAvatar} />
      <Text style={styles.playerName}>{player.name}</Text>
      <Text style={styles.playerScore}>{player.score}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>赛事</Text>
        </View>
        <ScrollView style={styles.content}>
          {/* 赛事列表 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>热门赛事</Text>
            <View style={styles.tournamentList}>{tournaments.map(renderTournamentItem)}</View>
          </View>

          {/* 排行榜 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>排行榜</Text>
            <View style={styles.leaderboardContainer}>
              <View style={styles.leaderboardHeader}>
                <Text style={styles.leaderboardHeaderText}>排名</Text>
                <Text style={[styles.leaderboardHeaderText, styles.playerNameHeader]}>玩家</Text>
                <Text style={styles.leaderboardHeaderText}>积分</Text>
              </View>
              {leaderboard.map(renderLeaderboardItem)}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#6c5ce7',
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f3fe',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#6c5ce7',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#5b4ddb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  tournamentList: {
    marginBottom: 10,
  },
  tournamentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  tournamentImage: {
    width: 100,
    height: 100,
  },
  tournamentInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  tournamentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tournamentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tournamentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tournamentDetail: {
    fontSize: 12,
    color: '#666',
  },
  leaderboardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  leaderboardHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leaderboardHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    flex: 1,
  },
  playerNameHeader: {
    flex: 2,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  topRank: {
    color: '#6c5ce7',
  },
  playerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  playerName: {
    fontSize: 14,
    color: '#333',
    flex: 2,
  },
  playerScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
});
