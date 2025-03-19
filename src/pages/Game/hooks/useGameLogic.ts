import { useState, useCallback, useEffect } from 'react';
import { HistoryRecord, RoundStats } from '../components/types';
import {
  getInitialRoundStats,
  isGameOver,
  shouldAdvanceToNextRound,
  calculateNextRoundBetAmount,
  isSecond3kRound,
} from '../utils/gameLogic';
import { groupHistoryByRound, createHistoryRecord } from '../utils/historyHelper';

// 定义选择类型
export type BetChoice = 'banker_win' | 'banker_lose' | 'player_win' | 'player_lose' | null;

export const useGameLogic = (_operator: string = 'operator', _gameName: string = 'gameName') => {
  // 游戏状态
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [gameNumber, setGameNumber] = useState(1);
  const [round, _setRound] = useState(1);

  // 押注数据
  const [banker, setBanker] = useState(0);
  const [player, setPlayer] = useState(0);
  const [betAmount, setBetAmount] = useState(0);

  // 结果相关
  const [result, setResult] = useState('');
  const [winAmount, setWinAmount] = useState(0);

  // 历史记录
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  // 模态框状态
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);

  // 游戏状态
  const [roundStats, setRoundStats] = useState<RoundStats>(getInitialRoundStats());

  // 分组历史记录 (按轮次)
  const groupedHistory = groupHistoryByRound(history);

  // 游戏结果弹窗
  const [gameResultMessage, setGameResultMessage] = useState<string>('');

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

      const newValue = Math.max(0, value);
      setBanker(newValue);

      // 直接设置总押注金额，不自动触发确认对话框
      setBetAmount(newValue + player);
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

    // 设置游戏状态为进行中
    setGameStatus('playing');

    // 模拟游戏进行，3秒后显示结果
    setTimeout(() => {
      // 随机生成游戏结果
      const isWin = Math.random() > 0.5;
      let gameResult = '';
      let winningAmount = 0;

      if (banker > 0 && player === 0) {
        // 只押注庄家
        gameResult = isWin ? '庄赢' : '庄输';
        winningAmount = isWin ? banker * 0.95 : -banker;
      } else if (banker === 0 && player > 0) {
        // 只押注闲家
        gameResult = isWin ? '闲赢' : '闲输';
        winningAmount = isWin ? player : -player;
      } else {
        // 两边都押注（通常不建议，这里简化处理）
        const isBankerWin = Math.random() > 0.5;
        gameResult = isBankerWin ? '庄赢' : '闲赢';
        winningAmount = isBankerWin ? banker * 0.95 - player : player - banker;
      }

      // 更新结果
      setResult(gameResult);
      setWinAmount(winningAmount);

      // 添加到历史记录
      const currentTime = new Date().toLocaleTimeString();
      const newRecord: HistoryRecord = {
        id: Date.now(),
        time: currentTime,
        result: gameResult,
        betAmount: banker + player,
        round,
        gameNumber,
        isWin: winningAmount > 0,
      };

      setHistory((prev) => [...prev, newRecord]);

      // 设置游戏状态为已完成
      setGameStatus('finished');

      // 显示结果对话框
      setIsResultModalVisible(true);
    }, 3000);
  }, [banker, player, gameNumber, round]);

  // 关闭结果对话框后，重置游戏
  useEffect(() => {
    if (!isResultModalVisible && gameStatus === 'finished') {
      // 重置押注
      setBanker(0);
      setPlayer(0);

      // 增加局数
      setGameNumber((prev) => prev + 1);

      // 重置游戏状态为等待押注
      setGameStatus('waiting');
    }
  }, [isResultModalVisible, gameStatus]);

  // 检查游戏规则并更新轮次
  const checkGameRules = useCallback((isWin: boolean): void => {
    setRoundStats((prevStats) => {
      const newStats = { ...prevStats };
      newStats.gamesPlayed += 1;

      if (isWin) {
        newStats.wins += 1;
        // 重置连续负局计数
        newStats.consecutiveLosses = 0;
      } else {
        newStats.losses += 1;
        // 更新连续负局计数
        newStats.consecutiveLosses += 1;
      }

      // 检查是否需要进入下一轮或结束游戏
      let resultMessage = '';

      // 判断游戏是否结束
      if (isGameOver(newStats)) {
        if (newStats.isFirstRound) {
          resultMessage = '初始轮净负5局，游戏结束！';
        } else if (newStats.is3kRoundAgain) {
          if (newStats.consecutiveLosses >= 2) {
            resultMessage = '第二次3k轮连续负2局，游戏结束！';
          } else {
            resultMessage = '第二次3k轮净负1局，游戏结束！';
          }
        } else {
          resultMessage = `第${newStats.round}轮净负3局，游戏结束！`;
        }
        setGameResultMessage(resultMessage);
        setIsResultModalVisible(true);
        return newStats;
      }

      // 判断是否进入下一轮
      if (shouldAdvanceToNextRound(newStats)) {
        const oldRound = newStats.round;
        const isFirstRoundTransition = newStats.isFirstRound;
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
          resultMessage = `恭喜！初始轮净胜2局，进入第${newStats.round}轮。押注金额保持${newStats.betAmount}元`;
        } else if (isSecond3k) {
          newStats.is3kRoundAgain = true;
          newStats.maxGames = 3; // 第二次3k轮最多3局
          resultMessage = `提示：第${oldRound}轮降级，进入第二次3K轮（第${newStats.round}轮）。押注金额调整为${newStats.betAmount}元，最多可进行3局游戏`;
        } else {
          const netWins = newStats.wins - newStats.losses;
          if (netWins >= 3) {
            resultMessage = `恭喜！第${oldRound}轮净胜${netWins}局，进入第${newStats.round}轮。押注金额提升2000至${newStats.betAmount}元`;
          } else if (netWins > 0) {
            resultMessage = `恭喜！第${oldRound}轮净胜${netWins}局，进入第${newStats.round}轮。押注金额提升1000至${newStats.betAmount}元`;
          } else {
            // 这种情况不应该发生，为了安全保留代码
            resultMessage = `第${oldRound}轮平局，进入第${newStats.round}轮。押注金额保持${newStats.betAmount}元`;
          }
        }

        setGameResultMessage(resultMessage);
        setIsResultModalVisible(true);
      } else if (!newStats.isFirstRound && !newStats.is3kRoundAgain && newStats.losses - newStats.wins >= 1) {
        // 如果是第二轮以后，且净负1局但不需要进入下一轮（即没有第二次进入3k轮的情况）
        // 需要降级并减少押注金额
        const oldRound = newStats.round;
        const oldBetAmount = newStats.betAmount;

        // 计算下一轮的押注金额（降级）
        const nextBetAmount = Math.max(1000, oldBetAmount - 1000);

        // 检查是否是第二次进入3k轮
        const isSecond3k = isSecond3kRound(oldBetAmount, nextBetAmount, false, oldRound);

        if (isSecond3k) {
          // 如果是第二次进入3k轮
          newStats.round += 1;
          newStats.wins = 0;
          newStats.losses = 0;
          newStats.consecutiveLosses = 0;
          newStats.gamesPlayed = 0;
          newStats.betAmount = nextBetAmount;
          newStats.is3kRoundAgain = true;
          newStats.maxGames = 3; // 第二次3k轮最多3局

          resultMessage = `提示：第${oldRound}轮净负1局，降级进入第二次3K轮（第${newStats.round}轮）。押注金额调整为${newStats.betAmount}元，最多可进行3局游戏`;
          setGameResultMessage(resultMessage);
          setIsResultModalVisible(true);
        } else {
          // 普通降级
          newStats.round += 1;
          newStats.wins = 0;
          newStats.losses = 0;
          newStats.consecutiveLosses = 0;
          newStats.gamesPlayed = 0;
          newStats.betAmount = nextBetAmount;
          newStats.maxGames = 3;

          resultMessage = `第${oldRound}轮净负1局，降级进入第${newStats.round}轮。押注金额减少1000至${newStats.betAmount}元`;
          setGameResultMessage(resultMessage);
          setIsResultModalVisible(true);
        }
      }

      return newStats;
    });
  }, []);

  // 添加历史记录
  const addHistory = useCallback(
    (choice: BetChoice) => {
      if (!choice) {
        return;
      }

      // 根据选择确定是否赢局
      const isWin = choice === 'banker_win' || choice === 'player_win';

      try {
        // 创建记录
        const newRecord = createHistoryRecord(
          choice,
          roundStats.betAmount, // 始终传递当前轮次的押注金额，在createHistoryRecord中会根据isWin决定正负
          roundStats.round,
          roundStats.gamesPlayed + 1,
        );

        // 更新历史记录
        setHistory((prev) => [newRecord, ...prev]);

        // 关闭弹窗
        setIsConfirmModalVisible(false);

        // 检查游戏规则
        checkGameRules(isWin);

        // 重置押注
        setBanker(0);
        setPlayer(0);
      } catch (error) {
        setIsConfirmModalVisible(false);
      }
    },
    [roundStats.betAmount, roundStats.round, roundStats.gamesPlayed, checkGameRules],
  );

  // 重新开始游戏
  const restartGame = useCallback(() => {
    setRoundStats(getInitialRoundStats());
    setHistory([]);
    setIsResultModalVisible(false);
    setGameStatus('waiting');
  }, []);

  return {
    // 状态
    banker,
    player,
    betAmount,
    result,
    winAmount,
    gameNumber,
    gameStatus,
    round,
    roundStats,
    history,
    groupedHistory,
    isConfirmModalVisible,
    isResultModalVisible,
    gameResultMessage,

    // 事件处理
    handleBankerChange,
    handlePlayerChange,
    confirmBet,
    addHistory,
    continueGame,
    restartGame,

    // 弹窗控制
    setIsConfirmModalVisible,
    setIsResultModalVisible,
  };
};
