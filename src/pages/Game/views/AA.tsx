import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GameModal } from '../components/common/GameModal';
import { GameHistory } from '../components/common/GameHistory';
import { GameActions } from '../components/common/GameActions';
import { GameStatusModal } from '../components/AA/GameStatusModal';
import { GameInfo } from '../components/AA/GameInfo';
import { GameRule } from '../components/AA/GameRule';
import { useAAGameLogic } from '../hooks/useAAGameLogic';
import { BetChoice } from '../types/common';
import { deleteInning } from '../../../api/services/inningService';
import { getRoundDetail } from '../../../api/services/roundService';
import { updateAAGameStats } from '../utils/gameAALogic';
import { convertToHistoryRecords } from '../utils/historyHelper';

export interface AAGameProps {
  challengeName: string;
  operator: string;
  roundId: number;
  recorder: string;
  baseNumber: number;
  navigation: any;
}

export const AAGame: React.FC<AAGameProps> = React.memo((props) => {
  const { challengeName, operator, roundId, recorder, baseNumber, navigation } = props;

  const {
    currentChoice,
    setCurrentChoice,
    aaRoundStats,
    setAARoundStats,
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
  } = useAAGameLogic(baseNumber);

  // 添加结束本场确认弹窗状态
  const [endRoundModalVisible, setEndRoundModalVisible] = useState(false);
  // 添加删除上一局确认弹窗状态
  const [deleteLastInningModalVisible, setDeleteLastInningModalVisible] = useState(false);
  const [playRuleName, setPlayRuleName] = useState('');

  useEffect(() => {
    setRoundId(roundId);
    if (roundId) {
      // 加载场次详情数据
      getRoundDetail(roundId).then((roundData) => {
        if (roundData) {
          setPlayRuleName(roundData.playRuleName || '');
          const records = convertToHistoryRecords(roundData).reverse();
          setHistoryRecords(records);
          const updatedStats = updateAAGameStats(roundData);
          setAARoundStats(updatedStats);
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
          const updatedStats = updateAAGameStats(roundData);
          setAARoundStats(updatedStats);
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
    setAARoundStats,
    setGameStatusModalInfo,
    setIsSubmitting,
  ]);

  return (
    <>
      <View style={styles.content}>
        <GameInfo gameName={challengeName} operator={operator} recorder={recorder} aaRoundStats={aaRoundStats} />
        <GameRule
          playRuleName={playRuleName}
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
    </>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 10,
  },
  historyWrapper: {
    flex: 1,
    marginTop: 10,
  },
});
