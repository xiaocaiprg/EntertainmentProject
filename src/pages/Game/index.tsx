import React, { useCallback } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View } from 'react-native';
import { GameHeader } from './components/GameHeader';
import { GameInfo } from './components/GameInfo';
import { GameRule } from './components/GameRule';
import { GameModal } from './components/GameModal';
import { GameStatusModal } from './components/GameStatusModal';
import { GameHistory } from './components/GameHistory';
import { useGameLogic } from './hooks/useGameLogic';
import { BetChoice, GameRouteParams } from './types';
import { RouteProp } from '@react-navigation/native';

// 扩展GameProps类型，提供更具体的route类型
type GameScreenProps = {
  route: RouteProp<{ params: GameRouteParams }, 'params'>;
  navigation: any;
};

export const Game: React.FC<GameScreenProps> = React.memo(({ route, navigation }) => {
  // 从路由参数中获取挑战相关信息
  const {
    challengeName,
    operator,
    // 以下参数暂时未使用，保留以便将来扩展
    // challengeId,
    // isNewChallenge
  } = route.params;

  const {
    currentChoice,
    setCurrentChoice,
    roundStats,
    handleBankerChange,
    handlePlayerChange,
    continueGame,
    confirmModalVisible,
    setConfirmModalVisible,
    historyRecords,
    gameStatusModalInfo,
    confirmGameStatus,
  } = useGameLogic();

  // 处理庄赢
  const handleBankerWin = useCallback(() => {
    setConfirmModalVisible(true);
    setCurrentChoice(BetChoice.BANKER_WIN); // 庄家赢
    handleBankerChange(1);
  }, [handleBankerChange, setConfirmModalVisible, setCurrentChoice]);

  // 处理庄输
  const handleBankerLose = useCallback(() => {
    setConfirmModalVisible(true);
    setCurrentChoice(BetChoice.BANKER_LOSE); // 庄家输
    handleBankerChange(-1);
  }, [handleBankerChange, setConfirmModalVisible, setCurrentChoice]);

  // 处理闲赢
  const handlePlayerWin = useCallback(() => {
    setConfirmModalVisible(true);
    setCurrentChoice(BetChoice.PLAYER_WIN); // 闲家赢
    handlePlayerChange(1);
  }, [handlePlayerChange, setConfirmModalVisible, setCurrentChoice]);

  // 处理闲输
  const handlePlayerLose = useCallback(() => {
    setConfirmModalVisible(true);
    setCurrentChoice(BetChoice.PLAYER_LOSE); // 闲家输
    handlePlayerChange(-1);
  }, [handlePlayerChange, setConfirmModalVisible, setCurrentChoice]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />

      <GameHeader title="游戏详情" navigation={navigation} />

      <View style={styles.content}>
        <GameInfo gameName={challengeName} operator={operator} roundStats={roundStats} />

        <GameRule
          handleBankerWin={handleBankerWin}
          handleBankerLose={handleBankerLose}
          handlePlayerWin={handlePlayerWin}
          handlePlayerLose={handlePlayerLose}
        />

        <View style={styles.historyWrapper}>
          <GameHistory historyRecords={historyRecords} />
        </View>
      </View>

      {/* 确认下注弹窗 */}
      <GameModal
        visible={confirmModalVisible}
        title="确认结果"
        currentChoice={currentChoice}
        onCancel={() => setConfirmModalVisible(false)}
        onConfirm={() => continueGame()}
        confirmText="确认"
      />

      {/* 游戏状态弹窗（包含轮次结束和游戏结束） */}
      <GameStatusModal modalInfo={gameStatusModalInfo} onConfirm={confirmGameStatus} navigation={navigation} />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingBottom: 10,
  },
  historyWrapper: {
    flex: 1,
    marginTop: 10,
  },
});
