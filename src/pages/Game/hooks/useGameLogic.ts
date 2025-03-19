import { useState, useCallback, useEffect } from 'react';
import { RoundStats, BetChoice } from '../types';
import {
  getInitialRoundStats,
  shouldAdvanceToNextRound,
  calculateNextRoundBetAmount,
  isSecondInitRound,
  canSettleRound,
  isGameOver,
} from '../utils/gameLogic';

export const useGameLogic = () => {
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting'); // 游戏状态
  const [gameNumber, setGameNumber] = useState(1); // 游戏次数
  const [currentChoice, setCurrentChoice] = useState<BetChoice | null>(null); // 当前选择
  const [banker, setBanker] = useState(0); // 庄家押注输赢结果
  const [player, setPlayer] = useState(0); // 闲家押注输赢结果
  const [winAmount, setWinAmount] = useState(0); // 赢取金额
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // 弹窗状态
  const [gameOverModalVisible, setGameOverModalVisible] = useState(false); // 游戏结束弹窗
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
  const continueGame = useCallback(() => {
    // 关闭确认对话框
    setConfirmModalVisible(false);
    // 设置游戏状态为进行中
    setGameStatus('playing');
    // 确定游戏结果
    let winningAmount = 0;
    setWinAmount(winningAmount);
    // 更新游戏统计信息
    const newStats = { ...roundStats };
    newStats.gamesPlayed += 1;
    if (banker > 0 || player > 0) {
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
  }, [banker, player, roundStats]);

  // 处理游戏规则逻辑
  useEffect(() => {
    if (gameStatus === 'finished') {
      // 检查当前轮次是否可以结算（非初始轮必须满3局）
      if (canSettleRound(roundStats)) {
        // 是否需要进入下一轮
        if (shouldAdvanceToNextRound(roundStats)) {
          const oldRound = roundStats.round;
          const isFirstRoundTransition = roundStats.isFirstRound;
          // 更新轮次状态
          setRoundStats((prevStats) => {
            const newStats = { ...prevStats };
            const oldBetAmount = newStats.betAmount;
            // 计算下一轮的押注金额
            const nextBetAmount = calculateNextRoundBetAmount(newStats);

            // 检查是否是第二次进入初始轮
            const secondInitRound = isSecondInitRound(oldBetAmount, nextBetAmount, isFirstRoundTransition, oldRound);

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
            } else if (secondInitRound) {
              newStats.isFirstRoundAgain = true;
              newStats.maxGames = 3; // 第二次3k轮最多3局
            }

            return newStats;
          });
        }
        // 检查是否游戏结束
        if (isGameOver(roundStats)) {
          // 显示游戏结束弹窗
          setGameOverModalVisible(true);
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
  }, [gameStatus, roundStats]);

  return {
    gameStatus,
    gameNumber,
    currentChoice,
    setCurrentChoice,
    winAmount,
    roundStats,
    confirmModalVisible,
    setConfirmModalVisible,
    gameOverModalVisible,
    setGameOverModalVisible,
    handleBankerChange,
    handlePlayerChange,
    continueGame,
  };
};
