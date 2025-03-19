import { useState, useCallback, useEffect } from 'react';
import { HistoryRecord, RoundStats } from '../types';
import {
  getInitialRoundStats,
  shouldAdvanceToNextRound,
  calculateNextRoundBetAmount,
  isSecond3kRound,
  canSettleRound,
} from '../utils/gameLogic';
import { groupHistoryByRound } from '../utils/historyHelper';

export const useGameLogic = () => {
  // 游戏状态
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [gameNumber, setGameNumber] = useState(1);

  // 押注数据
  const [banker, setBanker] = useState(0);
  const [player, setPlayer] = useState(0);
  const [_betAmount, setBetAmount] = useState(0);

  // 结果相关
  const [result, setResult] = useState('');
  const [winAmount, setWinAmount] = useState(0);

  // 历史记录
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // 模态框状态
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  // 游戏状态
  const [roundStats, setRoundStats] = useState<RoundStats>(getInitialRoundStats());

  // 分组历史记录 (按轮次)
  const groupedHistory = groupHistoryByRound(history);

  // 确认押注 - 保留供其他组件使用
  const confirmBet = useCallback(() => {
    // 设置总押注金额
    const total = banker + player;
    setBetAmount(total);

    // 显示确认对话框
    setIsConfirmModalVisible(true);
  }, [banker, player]);

  // 处理庄家押注变化
  const handleBankerChange = useCallback(
    (value: number) => {
      if (gameStatus !== 'waiting') {
        return;
      }
      setBanker(value);
      // 直接设置总押注金额，不自动触发确认对话框
      setBetAmount(value + player);
    },
    [gameStatus, player],
  );

  // 处理闲家押注变化
  const handlePlayerChange = useCallback(
    (value: number) => {
      if (gameStatus !== 'waiting') {
        return;
      }

      const newValue = Math.max(0, value);
      setPlayer(newValue);

      // 直接设置总押注金额，不自动触发确认对话框
      setBetAmount(banker + newValue);
    },
    [gameStatus, banker],
  );

  // 继续游戏（用户确认押注后）
  const continueGame = useCallback(() => {
    // 关闭确认对话框
    setIsConfirmModalVisible(false);

    // 验证是否有有效押注
    if (banker === 0 && player === 0) {
      return;
    }

    // 设置游戏状态为进行中
    setGameStatus('playing');

    // 确定游戏结果（没有平局的可能性）
    let gameResult = '';
    let winningAmount = 0;

    // 根据用户选择确定游戏结果（没有平局）
    if (banker > 0 && player === 0) {
      // 只押注庄家
      gameResult = '庄赢';
      winningAmount = banker * 0.95;
    } else if (banker === 0 && player > 0) {
      // 只押注闲家
      gameResult = '闲赢';
      winningAmount = player;
    } else if (banker > 0 && player > 0) {
      // 两边都押注
      gameResult = '庄赢';
      winningAmount = banker * 0.95 - player;
    }

    // 更新结果
    setResult(gameResult);
    setWinAmount(winningAmount);

    // 创建新的历史记录
    const currentTime = new Date().toLocaleTimeString();
    const newRecord: HistoryRecord = {
      id: Date.now(),
      time: currentTime,
      result: gameResult,
      betAmount: winningAmount, // 使用实际赢得/损失的金额
      round: roundStats.round,
      gameNumber,
      isWin: winningAmount > 0,
      choice:
        banker > 0 && player === 0
          ? 'banker_win'
          : banker === 0 && player > 0
          ? 'player_win'
          : banker > 0 && player > 0
          ? 'banker_win'
          : null,
    };

    // 添加到历史记录
    setHistory((prev) => [...prev, newRecord]);

    // 更新游戏统计信息
    setRoundStats((prevStats) => {
      const newStats = { ...prevStats };
      newStats.gamesPlayed += 1;

      if (winningAmount > 0) {
        newStats.wins += 1;
        // 重置连续负局计数
        newStats.consecutiveLosses = 0;
      } else {
        newStats.losses += 1;
        // 更新连续负局计数
        newStats.consecutiveLosses += 1;
      }

      return newStats;
    });

    // 设置游戏状态为已完成
    setGameStatus('finished');
  }, [banker, player, gameNumber, roundStats.round, setHistory]);

  // 关闭结果对话框后，处理游戏规则逻辑
  useEffect(() => {
    if (gameStatus === 'finished') {
      // 检查当前轮次是否可以结算（非初始轮必须满3局）
      if (canSettleRound(roundStats)) {
        // 检查是否需要进入下一轮
        if (shouldAdvanceToNextRound(roundStats)) {
          const oldRound = roundStats.round;
          const isFirstRoundTransition = roundStats.isFirstRound;

          // 更新轮次状态
          setRoundStats((prevStats) => {
            const newStats = { ...prevStats };
            const oldBetAmount = newStats.betAmount;

            // 计算下一轮的押注金额
            const nextBetAmount = calculateNextRoundBetAmount(newStats);

            // 检查是否是第二次进入3k轮
            const isSecond3k = isSecond3kRound(oldBetAmount, nextBetAmount, isFirstRoundTransition, oldRound);

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
            } else if (isSecond3k) {
              newStats.isFirstRoundAgain = true;
              newStats.maxGames = 3; // 第二次3k轮最多3局
            }

            return newStats;
          });
        }
        // 检查是否需要降级（非初始轮净负）
        else if (!roundStats.isFirstRound && !roundStats.isFirstRoundAgain && roundStats.losses > roundStats.wins) {
          const oldRound = roundStats.round;
          const oldBetAmount = roundStats.betAmount;

          // 更新轮次状态
          setRoundStats((prevStats) => {
            const newStats = { ...prevStats };

            // 计算降级后的押注金额
            const nextBetAmount = Math.max(1000, oldBetAmount - 1000);

            // 检查是否是第二次进入3k轮
            const isSecond3k = isSecond3kRound(oldBetAmount, nextBetAmount, false, oldRound);

            if (isSecond3k) {
              // 更新为新一轮状态
              newStats.round += 1;
              newStats.wins = 0;
              newStats.losses = 0;
              newStats.consecutiveLosses = 0;
              newStats.gamesPlayed = 0;
              newStats.betAmount = nextBetAmount;
              newStats.isFirstRoundAgain = true;
              newStats.maxGames = 3;
            }
            return newStats;
          });
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
    round: roundStats.round,
    betAmount: roundStats.betAmount,
    banker,
    player,
    result,
    winAmount,
    history,
    groupedHistory,
    isConfirmModalVisible,
    roundStats,
    setIsConfirmModalVisible,
    handleBankerChange,
    handlePlayerChange,
    confirmBet,
    continueGame,
  };
};
