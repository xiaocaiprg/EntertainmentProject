import { useState, useCallback, useEffect, useRef } from 'react';
import { RoundStats, BetChoice, HistoryRecord, GameStatusModalInfo, BankerOrPlayerMap } from '../types';
import {
  getInitialRoundStats,
  shouldAdvanceToNextRound,
  calculateNextRoundBetAmount,
  isAgainInitRound,
  isGameOver,
  updateConsecutiveDemotions,
} from '../utils/gameLogic';
import { inningCreate } from '../../../api/services/inningService';
import { updateRoundStatus } from '../../../api/services/roundService';
import { createHistoryRecord } from '../utils/historyHelper';

export const useGameLogic = () => {
  const [gameStatus, setGameStatus] = useState<'waiting' | 'finished'>('waiting'); // 游戏状态
  const [gameNumber, setGameNumber] = useState(1); // 游戏次数
  const [currentChoice, setCurrentChoice] = useState<BetChoice | undefined>(undefined); // 当前选择
  const [banker, setBanker] = useState(0); // 庄家押注输赢结果
  const [player, setPlayer] = useState(0); // 闲家押注输赢结果
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // 弹窗状态
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]); // 历史记录
  const [roundId, setRoundId] = useState(0); // 场Id
  const [isSubmitting, setIsSubmitting] = useState(false); // 确认按钮状态
  // 合并游戏状态弹窗相关状态
  const [gameStatusModalInfo, setGameStatusModalInfo] = useState<GameStatusModalInfo>({
    visible: false,
    isGameOver: false,
    title: '',
    confirmText: '',
    nextRoundInfo: null,
  });
  const [roundStats, setRoundStats] = useState<RoundStats>(getInitialRoundStats()); // 游戏状态
  const isSubmittingRef = useRef(false); // 使用ref来标记接口请求状态

  // 处理庄押注结果
  const handleBankerChange = useCallback((value: number) => {
    setBanker(value);
  }, []);
  // 处理闲押注结果
  const handlePlayerChange = useCallback((value: number) => {
    setPlayer(value);
  }, []);
  // 继续游戏（用户点击确认弹窗后）
  const continueGame = useCallback(async () => {
    if (!currentChoice || isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true; // 开始提交前设置状态
    setIsSubmitting(true); // 更新状态
    const isWin = banker > 0 || player > 0;
    const isLoss = banker < 0 || player < 0;
    const params = {
      betNumber: roundStats.betAmount,
      eventNum: roundStats.round,
      isDealer: BankerOrPlayerMap[currentChoice],
      result: isWin ? 1 : 2,
      roundId: roundId,
    };
    const inningResult = await inningCreate(params);

    isSubmittingRef.current = false; // 重置ref状态
    setIsSubmitting(false); // 重置状态
    // 如果请求失败，显示错误提示弹窗
    if (!inningResult) {
      console.log('提交游戏结果失败');
      setGameStatusModalInfo({
        visible: true,
        isGameOver: false,
        title: '提交失败',
        confirmText: '请重新输入',
        nextRoundInfo: null,
      });
      // 重置游戏状态为等待
      setGameStatus('waiting');
      return;
    }
    // 创建并添加历史记录
    if (currentChoice) {
      const newRecord = createHistoryRecord(
        inningResult.gameInningDto.id,
        roundStats.round,
        gameNumber,
        currentChoice,
        isWin,
        roundStats.betAmount,
      );
      setHistoryRecords((prev) => [newRecord, ...prev]);
    }
    // 更新游戏统计信息
    const newStats = { ...roundStats };
    newStats.gamesPlayed += 1;
    if (isWin) {
      newStats.wins += 1;
      // 重置连续负局计数
      newStats.consecutiveLosses = 0;
    } else if (isLoss) {
      newStats.losses += 1;
      // 更新连续负局计数
      newStats.consecutiveLosses += 1;
    }
    // 更新连续输的次数
    newStats.consecutiveDemotions = updateConsecutiveDemotions(newStats);
    newStats.roundProfitStr = inningResult?.profitStr;
    newStats.roundTurnOverStr = inningResult?.turnOverStr;
    newStats.challengeProfitStr = inningResult?.totalProfitStr;
    newStats.challengeTurnOverStr = inningResult?.totalTurnOverStr;
    setRoundStats(newStats);
    // 关闭确认对话框
    setConfirmModalVisible(false);
    // 设置游戏状态为已完成
    setGameStatus('finished');
  }, [banker, player, roundStats, currentChoice, gameNumber, roundId]);

  // 确认游戏状态弹窗
  const confirmGameStatus = useCallback(() => {
    setGameStatusModalInfo((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  // 更新本场状态
  const updateRound = useCallback(async () => {
    if (!roundId) {
      return false;
    }
    const res = await updateRoundStatus({
      id: roundId,
      isEnabled: 0,
    });
    if (res) {
      setGameStatusModalInfo({
        visible: true,
        isGameOver: true,
        title: '本场已结束',
        confirmText: '返回首页',
        nextRoundInfo: null,
      });
    } else {
      setGameStatusModalInfo({
        visible: true,
        isGameOver: true,
        title: '状态异常',
        roundId: roundId,
        confirmText: '返回首页',
        nextRoundInfo: null,
      });
    }
    return !!res;
  }, [roundId]);

  // 结束本场函数
  const handleEndRound = useCallback(async () => {
    if (!roundId) {
      return;
    }
    setIsSubmitting(true);
    await updateRound();
    setIsSubmitting(false);
  }, [roundId, updateRound]);

  // 处理游戏规则逻辑
  useEffect(() => {
    const handleGameLogic = async () => {
      if (gameStatus === 'finished') {
        console.log('游戏状态为finished,轮次信息', roundStats);
        // 检查是否游戏结束
        const isGameOverResult = isGameOver(roundStats);
        if (isGameOverResult) {
          const updateSuccess = await updateRound();
          console.log('结束本场结果', updateSuccess);
          return;
        }
        // 是否进入下一轮
        if (shouldAdvanceToNextRound(roundStats, isGameOverResult)) {
          const oldRound = roundStats.round;
          const isFirstRoundTransition = roundStats.isFirstRound;

          // 计算下一轮的押注金额和信息
          const nextBetAmount = calculateNextRoundBetAmount(roundStats);

          // 显示轮次结束弹窗
          setGameStatusModalInfo({
            visible: true,
            isGameOver: false,
            title: '轮次结束',
            confirmText: '开始下一轮',
            nextRoundInfo: {
              currentRound: oldRound,
              nextRound: oldRound + 1,
              nextBetAmount,
            },
          });
          // 更新轮次状态
          setRoundStats((prevStats) => {
            const newStats = { ...prevStats };
            // 检查是否是再次进入初始轮
            const againInitRound = isAgainInitRound(
              newStats.betAmount,
              nextBetAmount,
              isFirstRoundTransition,
              oldRound,
            );
            // 更新为下一轮状态
            newStats.round += 1;
            newStats.wins = 0;
            newStats.losses = 0;
            newStats.consecutiveLosses = 0;
            newStats.gamesPlayed = 0;
            newStats.betAmount = nextBetAmount;
            // 设置最大游戏次数
            if (isFirstRoundTransition) {
              newStats.isFirstRound = false;
              newStats.maxGames = 3; // 第二轮开始每轮3局
            } else if (againInitRound) {
              newStats.isFirstRoundAgain = true;
              newStats.maxGames = 3; // 再次进入初始轮最多3局
            } else {
              newStats.isFirstRoundAgain = false;
              newStats.maxGames = 3; // 非初始轮最多3局
            }
            return newStats;
          });
        }
        // 重置押注
        setBanker(0);
        setPlayer(0);
        // 重置游戏状态为等待押注
        setGameStatus('waiting');
        // 增加局数
        setGameNumber((prev) => prev + 1);
      }
    };
    handleGameLogic();
  }, [gameStatus, roundId, roundStats, updateRound]);

  return {
    gameStatus,
    setGameStatus,
    gameNumber,
    setGameNumber,
    currentChoice,
    setCurrentChoice,
    roundStats,
    setRoundStats,
    roundId,
    setRoundId,
    confirmModalVisible,
    setConfirmModalVisible,
    handleBankerChange,
    handlePlayerChange,
    continueGame,
    historyRecords,
    setHistoryRecords,
    gameStatusModalInfo,
    setGameStatusModalInfo,
    confirmGameStatus,
    isSubmitting,
    setIsSubmitting,
    handleEndRound,
  };
};
