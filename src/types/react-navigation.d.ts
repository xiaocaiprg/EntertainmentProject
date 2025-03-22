declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Main: undefined;
      Auth: undefined;
      Game: {
        challengeName: string; // 挑战名称（必填）
        operator: string; // 操作员（必填）
        challengeId?: string; // 挑战ID（可选，仅在现有挑战时存在）
        isNewChallenge?: boolean; // 是否新挑战（可选）
      };
    }
  }
}

// 确保这个文件被视为模块
export {};
