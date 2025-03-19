import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View } from 'react-native';
import { GameHeader } from './components/GameHeader';
import { GameInfo } from './components/GameInfo';
import { GameRule } from './components/GameRule';
import { HistoryList } from './components/HistoryList';
import { GameModal } from './components/GameModal';
import { useGameLogic } from './hooks/useGameLogic';
import { BetChoice, GameProps } from './types';

export const Game: React.FC<GameProps> = React.memo(({ navigation }) => {
  const {
    banker: bankerValue,
    player: playerValue,
    roundStats,
    groupedHistory,
    isConfirmModalVisible: modalVisible,
    handleBankerChange,
    handlePlayerChange,
    confirmBet,
    continueGame,
    setIsConfirmModalVisible,
  } = useGameLogic();

  // 当前选择
  const [currentChoice, setCurrentChoice] = React.useState<BetChoice>(null);

  // 处理庄赢
  const handleBankerWin = React.useCallback(() => {
    setCurrentChoice('banker_win'); // 庄家赢
    handleBankerChange(roundStats.betAmount);
    confirmBet();
  }, [handleBankerChange, roundStats.betAmount, confirmBet]);

  // 处理庄输
  const handleBankerLose = React.useCallback(() => {
    setCurrentChoice('banker_lose'); // 庄家输
    handleBankerChange(-roundStats.betAmount);
    confirmBet();
  }, [handleBankerChange, roundStats.betAmount, confirmBet]);

  // 处理闲赢
  const handlePlayerWin = React.useCallback(() => {
    setCurrentChoice('player_win'); // 闲家赢
    handlePlayerChange(roundStats.betAmount);
    confirmBet();
  }, [handlePlayerChange, roundStats.betAmount, confirmBet]);

  // 处理闲输
  const handlePlayerLose = React.useCallback(() => {
    setCurrentChoice('player_lose'); // 闲家输
    handlePlayerChange(-roundStats.betAmount);
    confirmBet();
  }, [handlePlayerChange, roundStats.betAmount, confirmBet]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />

      <GameHeader title="游戏详情" navigation={navigation} />

      <View style={styles.content}>
        <GameInfo gameName={'gameName'} operator={'operator'} roundStats={roundStats} />

        <GameRule
          bankerValue={bankerValue}
          playerValue={playerValue}
          handleBankerWin={handleBankerWin}
          handleBankerLose={handleBankerLose}
          handlePlayerWin={handlePlayerWin}
          handlePlayerLose={handlePlayerLose}
        />

        <View style={styles.historyWrapper}>
          <HistoryList groupedHistory={groupedHistory} />
        </View>
      </View>

      {/* 确认下注弹窗 */}
      <GameModal
        visible={modalVisible}
        title="确认结果"
        currentChoice={currentChoice}
        onCancel={() => setIsConfirmModalVisible(false)}
        onConfirm={() => continueGame()}
        confirmText="确认"
      />
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
