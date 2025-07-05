import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GameActions } from '../components/common/GameActions';
import { GameHistory } from '../components/common/GameHistory';
import { GameModal } from '../components/common/GameModal';
import { GameInfo } from '../components/DD/GameInfo';
import { GameRule } from '../components/DD/GameRule';
import { GameStatusModal } from '../components/DD/GameStatusModal';
import { ConfirmBetModal } from '../components/DD/ConfirmBetModal';
import { useDDGameLogic } from '../hooks/useDDGameLogic';
import { BetChoice } from '../types/common';
import { deleteInning } from '../../../api/services/inningService';
import { getRoundDetail } from '../../../api/services/roundService';
import { updateDDGameStats } from '../utils/gameDDLogic';
import { convertToHistoryRecords } from '../utils/historyHelper';

export interface DDGameProps {
  challengeName: string;
  operator: string;
  roundId: number;
  recorder: string;
  baseNumber: number;
  navigation: any;
}

export const DDGame: React.FC<DDGameProps> = React.memo((props) => {
  const { challengeName, operator, roundId, recorder, navigation } = props;

  const {
    currentChoice,
    setCurrentChoice,
    ddRoundStats,
    setDDRoundStats,
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
    selectedBetAmount,
    setSelectedBetAmount,
  } = useDDGameLogic();

  // 添加结束本场确认弹窗状态
  const [endRoundModalVisible, setEndRoundModalVisible] = useState(false);
  // 添加删除上一局确认弹窗状态
  const [deleteLastInningModalVisible, setDeleteLastInningModalVisible] = useState(false);
  const [playRuleName, setPlayRuleName] = useState('');
  const [baseNumberList, setBaseNumberList] = useState<number[]>([]);

  useEffect(() => {
    setRoundId(roundId);
    if (roundId) {
      // 加载场次详情数据
      getRoundDetail(roundId).then((roundData) => {
        if (roundData) {
          setPlayRuleName(roundData.playRuleName || '');
          if (roundData.baseNumberList && roundData.baseNumberList.length > 0) {
            setBaseNumberList(roundData.baseNumberList);
          }
          const records = convertToHistoryRecords(roundData).reverse();
          setHistoryRecords(records);
          const updatedStats = updateDDGameStats(roundData);
          setDDRoundStats(updatedStats);
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

  // 处理投注金额变化
  const handleBetAmountChange = useCallback(
    (amount: number) => {
      setSelectedBetAmount(amount);
    },
    [setSelectedBetAmount],
  );

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
          const updatedStats = updateDDGameStats(roundData);
          setDDRoundStats(updatedStats);
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
    setDDRoundStats,
    setGameStatusModalInfo,
    setIsSubmitting,
  ]);

  return (
    <>
      <View style={styles.content}>
        <GameInfo gameName={challengeName} operator={operator} recorder={recorder} ddRoundStats={ddRoundStats} />
        <GameRule
          playRuleName={playRuleName}
          baseNumberList={baseNumberList}
          selectedBetAmount={selectedBetAmount}
          onBetAmountChange={handleBetAmountChange}
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
      <ConfirmBetModal
        visible={confirmModalVisible}
        title="确认结果"
        currentChoice={currentChoice}
        selectedBetAmount={selectedBetAmount}
        isSubmitting={isSubmitting}
        confirmText="确认"
        onCancel={() => setConfirmModalVisible(false)}
        onConfirm={() => continueGame()}
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
