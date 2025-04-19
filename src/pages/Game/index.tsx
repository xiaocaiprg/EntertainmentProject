import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View } from 'react-native';
import { GameHeader } from './components/GameHeader';
import { GameInfo } from './components/GameInfo';
import { GameRule } from './components/GameRule';
import { GameModal } from './components/GameModal';
import { GameStatusModal } from './components/GameStatusModal';
import { GameHistory } from './components/GameHistory';
import { GameActions } from './components/GameActions';
import { useGameLogic } from './hooks/useGameLogic';
import { BetChoice } from './types';
import { deleteInning } from '../../api/services/gameService';
import { getRoundDetail } from '../../api/services/roundService';
import { RootStackScreenProps } from '../router';
import { updateGameStats } from './utils/gameLogic';
import { isIOS, STATUS_BAR_HEIGHT } from '../../utils/platform';
import { convertToHistoryRecords } from './utils/historyHelper';
// 使用导航栈中定义的类型
type GameScreenProps = RootStackScreenProps<'Game'>;

export const Game: React.FC<GameScreenProps> = React.memo(({ route, navigation }) => {
  const { challengeName, operator, roundId, recorder } = route.params;
  const {
    currentChoice,
    setCurrentChoice,
    roundStats,
    setRoundStats,
    handleBankerChange,
    handlePlayerChange,
    continueGame,
    confirmModalVisible,
    setConfirmModalVisible,
    gameStatusModalInfo,
    setGameStatusModalInfo,
    confirmGameStatus,
    setRoundId,
    historyRecords,
    setHistoryRecords,
    setGameStatus,
    setGameNumber,
    isSubmitting,
    setIsSubmitting,
    handleEndRound,
  } = useGameLogic();

  // 添加结束本场确认弹窗状态
  const [endRoundModalVisible, setEndRoundModalVisible] = useState(false);
  // 添加删除上一局确认弹窗状态
  const [deleteLastInningModalVisible, setDeleteLastInningModalVisible] = useState(false);

  useEffect(() => {
    setRoundId(roundId);
    if (roundId) {
      // 加载场次详情数据
      getRoundDetail(roundId).then((roundData) => {
        if (roundData) {
          const records = convertToHistoryRecords(roundData).reverse();
          setHistoryRecords(records);
          const updatedStats = updateGameStats(roundData);
          setRoundStats(updatedStats);
          setGameStatus('finished');
          setGameNumber(records.length + 1);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 处理庄赢
  const handleBankerWin = useCallback(() => {
    setCurrentChoice(BetChoice.BANKER_WIN); // 庄家赢
    handleBankerChange(1);
    setConfirmModalVisible(true);
  }, [handleBankerChange, setConfirmModalVisible, setCurrentChoice]);

  // 处理庄输
  const handleBankerLose = useCallback(() => {
    setCurrentChoice(BetChoice.BANKER_LOSE); // 庄家输
    handleBankerChange(-1);
    setConfirmModalVisible(true);
  }, [handleBankerChange, setConfirmModalVisible, setCurrentChoice]);

  // 处理闲赢
  const handlePlayerWin = useCallback(() => {
    setCurrentChoice(BetChoice.PLAYER_WIN); // 闲家赢
    handlePlayerChange(1);
    setConfirmModalVisible(true);
  }, [handlePlayerChange, setConfirmModalVisible, setCurrentChoice]);

  // 处理闲输
  const handlePlayerLose = useCallback(() => {
    setCurrentChoice(BetChoice.PLAYER_LOSE); // 闲家输
    handlePlayerChange(-1);
    setConfirmModalVisible(true);
  }, [handlePlayerChange, setConfirmModalVisible, setCurrentChoice]);

  // 打开结束本场确认弹窗
  const handleOpenEndRoundModal = useCallback(() => {
    setEndRoundModalVisible(true);
  }, []);

  // 打开删除上一局确认弹窗
  const handleOpenDeleteLastInningModal = useCallback(() => {
    if (historyRecords.length === 0) {
      setGameStatusModalInfo({
        visible: true,
        isGameOver: false,
        title: '无可删除的历史记录',
        confirmText: '确认',
        nextRoundInfo: null,
      });
      return;
    }
    setDeleteLastInningModalVisible(true);
  }, [historyRecords.length, setGameStatusModalInfo]);

  // 处理删除上一局
  const handleDeleteLastInning = useCallback(async () => {
    try {
      setIsSubmitting(true);
      // 因为历史记录已经倒序排列，所以最后一局就是第一项
      const lastInning = historyRecords[0];
      const inningId = lastInning.id;
      await deleteInning(inningId);
      // 更新历史记录（删除第一项，即最后一局）
      const updatedRecords = historyRecords.slice(1);
      setHistoryRecords(updatedRecords);

      // 更新游戏状态
      if (roundId) {
        const roundData = await getRoundDetail(roundId);
        if (roundData) {
          const updatedStats = updateGameStats(roundData);
          setRoundStats(updatedStats);
          setGameStatus('finished');
        }
      }

      setGameStatusModalInfo({
        visible: true,
        isGameOver: false,
        title: '删除成功',
        confirmText: '确认',
        nextRoundInfo: null,
      });
    } catch (error) {
      setGameStatusModalInfo({
        visible: true,
        isGameOver: false,
        title: '删除失败, 请再试一次',
        confirmText: '确认',
        nextRoundInfo: null,
      });
    } finally {
      setIsSubmitting(false);
      setDeleteLastInningModalVisible(false);
    }
  }, [
    historyRecords,
    roundId,
    setHistoryRecords,
    setGameStatus,
    setRoundStats,
    setGameStatusModalInfo,
    setIsSubmitting,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <GameHeader title="挑战详情" navigation={navigation} />

      <View style={styles.content}>
        <GameInfo gameName={challengeName} operator={operator} recorder={recorder} roundStats={roundStats} />

        <GameRule
          handleBankerWin={handleBankerWin}
          handleBankerLose={handleBankerLose}
          handlePlayerWin={handlePlayerWin}
          handlePlayerLose={handlePlayerLose}
        />

        <GameActions onEndRound={handleOpenEndRoundModal} onDeleteLastInning={handleOpenDeleteLastInningModal} />

        <View style={styles.historyWrapper}>
          <GameHistory historyRecords={historyRecords} />
        </View>
      </View>

      {/* 确认下注弹窗 */}
      <GameModal
        visible={confirmModalVisible}
        isSubmitting={isSubmitting}
        title="确认结果"
        currentChoice={currentChoice}
        onCancel={() => setConfirmModalVisible(false)}
        onConfirm={() => continueGame()}
        confirmText="确认"
      />

      {/* 结束本场确认弹窗 */}
      <GameModal
        visible={endRoundModalVisible}
        title="确认结束本场"
        isSubmitting={isSubmitting}
        currentChoice={undefined}
        onCancel={() => setEndRoundModalVisible(false)}
        onConfirm={async () => {
          await handleEndRound();
          setEndRoundModalVisible(false);
        }}
        confirmText="确认结束"
        message="是否确认结束本场？结束后将无法继续,请谨慎操作。"
      />

      {/* 删除上一局确认弹窗 */}
      <GameModal
        visible={deleteLastInningModalVisible}
        title="确认删除"
        isSubmitting={isSubmitting}
        currentChoice={undefined}
        onCancel={() => setDeleteLastInningModalVisible(false)}
        onConfirm={handleDeleteLastInning}
        confirmText="确认删除"
        message="是否删除上一把？删除后不可恢复,请谨慎操作。"
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
    paddingTop: isIOS() ? 0 : STATUS_BAR_HEIGHT,
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
