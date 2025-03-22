import { useState, useCallback, useEffect } from 'react';
import { RoundStats, BetChoice, HistoryRecord, GameStatusModalInfo, BankerOrPlayerMap } from '../types';
import {
  getInitialRoundStats,
  shouldAdvanceToNextRound,
  calculateNextRoundBetAmount,
  isAgainInitRound,
  canSettleRound,
  isGameOver,
} from '../utils/gameLogic';
import { inningCreate, updateRoundStatus } from '../../../api/services/gameService';
import { createHistoryRecord } from '../utils/historyHelper';

export const useGameLogic = () => {
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting'); // 游戏状态
  const [gameNumber, setGameNumber] = useState(1); // 游戏次数
  const [currentChoice, setCurrentChoice] = useState<BetChoice | null>(null); // 当前选择
  const [banker, setBanker] = useState(0); // 庄家押注输赢结果
  const [player, setPlayer] = useState(0); // 闲家押注输赢结果
  const [winAmount, setWinAmount] = useState(0); // 赢取金额
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // 弹窗状态
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]); // 历史记录
  const [roundId, setRoundId] = useState(0); // 场Id
  // 合并游戏状态弹窗相关状态
  const [gameStatusModalInfo, setGameStatusModalInfo] = useState<GameStatusModalInfo>({
    visible: false,
    isGameOver: false,
    title: '',
    confirmText: '',
    nextRoundInfo: null,
  });
  const [roundStats, setRoundStats] = useState<RoundStats>(getInitialRoundStats()); // 游戏状态

  // 处理庄押注结果
  const handleBankerChange = useCallback(
    (value: number) => {
      if (gameStatus !== 'waiting') {
        return;
      }
      setBanker(value);
    },
    [gameStatus],
  );
  // 处理闲押注结果
  const handlePlayerChange = useCallback(
    (value: number) => {
      if (gameStatus !== 'waiting') {
        return;
      }
      setPlayer(value);
    },
    [gameStatus],
  );
  // 继续游戏（用户点击确认弹窗后）
  const continueGame = useCallback(async () => {
    if (!currentChoice) {
      return;
    }
    const isWin = banker > 0 || player > 0;
    const params = {
      betNumber: roundStats.betAmount,
      eventNum: roundStats.round,
      isDealer: BankerOrPlayerMap[currentChoice],
      result: isWin ? 1 : 2,
      roundId: roundId,
    };
    const result = await inningCreate(params);
    console.log('本局', result);
    // 关闭确认对话框
    setConfirmModalVisible(false);
    // 设置游戏状态为进行中
    setGameStatus('playing');
    // 确定游戏结果
    let winningAmount = 0;
    setWinAmount(winningAmount);

    // 创建并添加历史记录
    if (currentChoice) {
      const newRecord = createHistoryRecord(
        Date.now(),
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
    } else if (banker < 0 || player < 0) {
      newStats.losses += 1;
      // 更新连续负局计数
      newStats.consecutiveLosses += 1;
    }
    setRoundStats(newStats);
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

  // 处理游戏规则逻辑
  useEffect(() => {
    if (gameStatus === 'finished') {
      console.log('游戏状态为finished');
      // 检查当前轮次是否可以结算（非初始轮必须满3局）
      if (canSettleRound(roundStats)) {
        // 进入下一轮
        if (shouldAdvanceToNextRound(roundStats)) {
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
        // 检查是否游戏结束
        if (isGameOver(roundStats)) {
          updateRoundStatus({
            id: roundId,
            isEnabled: 0,
          }).then(() => {
            // 显示游戏结束弹窗
            setGameStatusModalInfo({
              visible: true,
              isGameOver: true,
              title: '本场已结束',
              confirmText: '返回首页',
              nextRoundInfo: null,
            });
          });
          return; // 游戏结束，不再继续
        }
      }
      // 重置押注
      setBanker(0);
      setPlayer(0);
      // 增加局数
      setGameNumber((prev) => prev + 1);
      // 重置游戏状态为等待押注
      setGameStatus('waiting');
    }
  }, [gameStatus, roundId, roundStats]);

  return {
    gameStatus,
    setGameStatus,
    gameNumber,
    setGameNumber,
    currentChoice,
    setCurrentChoice,
    winAmount,
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
    confirmGameStatus,
  };
};
