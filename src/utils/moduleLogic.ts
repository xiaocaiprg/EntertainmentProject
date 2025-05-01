import { ModuleConfig, UserRole, RoleModuleMapping, ModuleType } from '../interface/Role';

// 定义所有可用模块
export const availableModules: ModuleConfig[] = [
  {
    id: '1',
    title: 'modules.challengeNew',
    type: ModuleType.CHALLENGE_NEW,
    icon: 'add-circle',
    backgroundColor: '#6c5ce7',
  },
  {
    id: '2',
    title: 'modules.record',
    type: ModuleType.CHALLENGE_EXISTING,
    icon: 'history',
    backgroundColor: '#00b894',
  },
  {
    id: '3',
    title: 'modules.allChallengeList',
    type: ModuleType.ALL_CHALLENGE,
    icon: 'list',
    backgroundColor: '#e17055',
  },
  {
    id: '4',
    title: 'modules.updateRecorder',
    type: ModuleType.CHANGE_RECORDER_CHALLENGE,
    icon: 'check-circle',
    backgroundColor: '#fdcb6e',
  },
  {
    id: '5',
    title: 'modules.funding',
    type: ModuleType.FUNDRAISING_CHALLENGE,
    icon: 'monetization-on',
    backgroundColor: '#2ecc71',
  },
  {
    id: '6',
    title: 'modules.viewTranscoding',
    type: ModuleType.TURNOVER_QUERY,
    icon: 'swap-horiz',
    backgroundColor: '#0984e3',
  },
  {
    id: '7',
    title: 'modules.pitcher_ranking',
    type: ModuleType.PITCHER_RANKING,
    icon: 'leaderboard',
    backgroundColor: '#e84393',
  },
];

// 定义角色到模块的映射
export const roleModuleMappings: RoleModuleMapping[] = [
  {
    role: 'INVESTMENT_ADMIN',
    moduleTypes: [
      ModuleType.CHALLENGE_NEW,
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
    ],
  },
  {
    role: 'INVESTOR',
    moduleTypes: [
      ModuleType.ALL_CHALLENGE,
      ModuleType.FUNDRAISING_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
    ],
  },
  {
    role: 'RECORDER_ADMIN',
    moduleTypes: [ModuleType.ALL_CHALLENGE, ModuleType.TURNOVER_QUERY, ModuleType.PITCHER_RANKING],
  },
  {
    role: 'RECORDER',
    moduleTypes: [
      ModuleType.CHALLENGE_EXISTING,
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
    ],
  },
  {
    role: 'PLAY_ADMIN',
    moduleTypes: [ModuleType.ALL_CHALLENGE, ModuleType.TURNOVER_QUERY, ModuleType.PITCHER_RANKING],
  },
  {
    role: 'PLAYPERSON',
    moduleTypes: [ModuleType.ALL_CHALLENGE, ModuleType.TURNOVER_QUERY, ModuleType.PITCHER_RANKING],
  },
  {
    role: 'OPERATION_ADMIN',
    moduleTypes: [
      ModuleType.CHANGE_RECORDER_CHALLENGE,
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
    ],
  },
  {
    role: 'OPERATIONPERSON',
    moduleTypes: [
      ModuleType.CHANGE_RECORDER_CHALLENGE,
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
    ],
  },
  {
    role: 'VISITOR',
    moduleTypes: [ModuleType.ALL_CHALLENGE, ModuleType.TURNOVER_QUERY, ModuleType.PITCHER_RANKING],
  },
];

// 获取用户可访问的模块列表
export const getUserAccessibleModules = (userRole?: UserRole): ModuleConfig[] => {
  if (!userRole) {
    return [];
  }

  const roleMapping = roleModuleMappings.find((mapping) => mapping.role === userRole);
  if (!roleMapping) {
    return [];
  }

  // 根据模块类型过滤可访问的模块
  return availableModules.filter((module) => roleMapping.moduleTypes.includes(module.type));
};
