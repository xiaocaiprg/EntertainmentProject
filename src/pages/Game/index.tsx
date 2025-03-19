import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Text, View } from 'react-native';
import { GameHeader } from './components/GameHeader';
import { GameInfo } from './components/GameInfo';
import { GameRule } from './components/GameRule';
import { HistoryList } from './components/HistoryList';
import { GameModal } from './components/GameModal';
import { useGameLogic } from './hooks/useGameLogic';
import { GameProps } from './components/types';
import { BetChoice } from './hooks/useGameLogic';

export const Game: React.FC<GameProps> = React.memo(({ navigation }) => {
  const {
    banker: bankerValue,
    player: playerValue,
    roundStats,
    groupedHistory,
    isConfirmModalVisible: modalVisible,
    isResultModalVisible: resultModalVisible,
    gameResultMessage,
    handleBankerChange,
    handlePlayerChange,
    addHistory,
    restartGame,
    setIsConfirmModalVisible: setModalVisible,
    setIsResultModalVisible: setResultModalVisible,
  } = useGameLogic();

  // 当前选择
  const [currentChoice, setCurrentChoice] = React.useState<BetChoice>(null);

  // 处理庄赢
  const handleBankerWin = React.useCallback(() => {
    setCurrentChoice('banker_win'); // 庄家赢
    // 直接设置押注金额为roundStats.betAmount
    handleBankerChange(roundStats.betAmount);
    // 直接显示确认对话框，无需等待检查
    setTimeout(() => {
      setModalVisible(true);
    }, 50);
  }, [handleBankerChange, roundStats.betAmount, setModalVisible]);

  // 处理庄输
  const handleBankerLose = React.useCallback(() => {
    setCurrentChoice('banker_lose'); // 庄家输
    // 对于庄输，不设置押注金额
    handleBankerChange(0);
    // 直接显示确认对话框，无需等待检查
    setTimeout(() => {
      setModalVisible(true);
    }, 50);
  }, [handleBankerChange, setModalVisible]);

  // 处理闲赢
  const handlePlayerWin = React.useCallback(() => {
    setCurrentChoice('player_win'); // 闲家赢
    // 直接设置押注金额为roundStats.betAmount
    handlePlayerChange(roundStats.betAmount);
    // 直接显示确认对话框，无需等待检查
    setTimeout(() => {
      setModalVisible(true);
    }, 50);
  }, [handlePlayerChange, roundStats.betAmount, setModalVisible]);

  // 处理闲输
  const handlePlayerLose = React.useCallback(() => {
    setCurrentChoice('player_lose'); // 闲家输
    // 对于闲输，不设置押注金额
    handlePlayerChange(0);
    // 直接显示确认对话框，无需等待检查
    setTimeout(() => {
      setModalVisible(true);
    }, 50);
  }, [handlePlayerChange, setModalVisible]);

  // 获取当前轮游戏规则文本
  const getRoundRuleText = () => {
    if (roundStats.isFirstRound) {
      return '第一轮：不限局数，净负5局结束，净胜2局升级';
    } else if (roundStats.is3kRoundAgain) {
      return '第二次3K轮：最多3局，净负1局或连续负2局结束，净胜1局升级';
    } else {
      return '常规轮：每轮3局，净负3局结束，净胜1局升押注';
    }
  };

  // 获取弹窗显示消息
  const getModalMessage = () => {
    switch (currentChoice) {
      case 'banker_win':
        return (
          <React.Fragment>
            <Text>
              您选择了<Text style={styles.bankerText}>庄赢</Text>，确认提交吗？
            </Text>
            <Text style={styles.ruleText}>{getRoundRuleText()}</Text>
          </React.Fragment>
        );
      case 'banker_lose':
        return (
          <React.Fragment>
            <Text>
              您选择了<Text style={styles.bankerText}>庄输</Text>，确认提交吗？
            </Text>
            <Text style={styles.ruleText}>{getRoundRuleText()}</Text>
          </React.Fragment>
        );
      case 'player_win':
        return (
          <React.Fragment>
            <Text>
              您选择了<Text style={styles.playerText}>闲赢</Text>，确认提交吗？
            </Text>
            <Text style={styles.ruleText}>{getRoundRuleText()}</Text>
          </React.Fragment>
        );
      case 'player_lose':
        return (
          <React.Fragment>
            <Text>
              您选择了<Text style={styles.playerText}>闲输</Text>，确认提交吗？
            </Text>
            <Text style={styles.ruleText}>{getRoundRuleText()}</Text>
          </React.Fragment>
        );
      default:
        return <Text>请选择结果</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />

      <GameHeader title="游戏详情" navigation={navigation} />

      <View style={styles.content}>
        <GameInfo
          gameName={'gameName'}
          operator={'operator'}
          betAmount={roundStats.betAmount}
          round={roundStats.round}
          wins={roundStats.wins}
          losses={roundStats.losses}
          gamesPlayed={roundStats.gamesPlayed}
          maxGames={roundStats.maxGames}
          isFirstRound={roundStats.isFirstRound}
          is3kRoundAgain={roundStats.is3kRoundAgain}
        />

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
        message={getModalMessage()}
        onCancel={() => setModalVisible(false)}
        onConfirm={() => addHistory(currentChoice)}
        confirmText="确认"
      />

      {/* 游戏结果弹窗 */}
      <GameModal
        visible={resultModalVisible}
        title="游戏提示"
        message={gameResultMessage}
        showCancelButton={false}
        isFullWidthButton={true}
        onConfirm={gameResultMessage.includes('游戏结束') ? restartGame : () => setResultModalVisible(false)}
        confirmText={gameResultMessage.includes('游戏结束') ? '重新开始' : '继续游戏'}
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
  bankerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  playerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  ruleText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
});
