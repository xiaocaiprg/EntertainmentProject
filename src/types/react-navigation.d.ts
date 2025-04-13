declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Main: undefined;
      Auth: undefined;
      Game: {
        challengeName: string; // 挑战名称（必填）
        operator: string; // 操作员（必填）
        recorder: string; // 记录人（必填）
        challengeId?: number; // 挑战ID（可选，仅在现有挑战时存在）
        roundId?: number; //场Id
        isNewChallenge?: boolean; // 是否新挑战（可选）
      };
      NewChallenge: undefined;
      ExistingChallenge: undefined;
      GameHistory: undefined;
      AllChallenge: undefined;
      CompletedFundingChallenge: undefined;
      FundraisingChallenge: undefined;
      MyGames: undefined;
      TurnoverQuery: undefined;
      ChallengeDetail: {
        matchId: number; // 挑战ID
      };
    }
  }
}

// 确保这个文件被视为模块
export {};
