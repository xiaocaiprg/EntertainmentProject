declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Main: undefined;
      Auth: undefined;
      Game: {
        gameName?: string;
        operator?: string;
        betAmount?: number;
      };
    }
  }
}

// 确保这个文件被视为模块
export {};
