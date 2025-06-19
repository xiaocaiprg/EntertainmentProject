import { ModuleConfig, UserRole, RoleModuleMapping, ModuleType } from '../interface/Role';

// 定义所有可用模块
export const moduleConfigs: ModuleConfig[] = [
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
    title: 'modules.assignPitcher',
    type: ModuleType.ASSIGN_PITCHER_CHALLENGE,
    icon: 'assignment-ind',
    backgroundColor: '#ff9800',
  },
  {
    id: '7',
    title: 'modules.viewTranscoding',
    type: ModuleType.TURNOVER_QUERY,
    icon: 'swap-horiz',
    backgroundColor: '#0984e3',
  },
  {
    id: '8',
    title: 'modules.pitcher_ranking',
    type: ModuleType.PITCHER_RANKING,
    icon: 'leaderboard',
    backgroundColor: '#e84393',
  },
  {
    id: '9',
    title: 'modules.createRace',
    type: ModuleType.CREATE_RACE,
    icon: 'sports-score',
    backgroundColor: '#ff6b81',
  },
  {
    id: '10',
    title: 'modules.allRace',
    type: ModuleType.ALL_RACE,
    icon: 'emoji-events',
    backgroundColor: '#9b59b6',
  },
  {
    id: '11',
    title: 'modules.racePoolList',
    type: ModuleType.RACE_POOL_LIST,
    icon: 'attach-money',
    backgroundColor: '#00cec9',
  },
  {
    id: '12',
    title: 'modules.groupManagement',
    type: ModuleType.GROUP_MANAGEMENT,
    icon: 'account-tree',
    backgroundColor: '#2d3436',
  },
  {
    id: '13',
    title: 'modules.companyManagement',
    type: ModuleType.COMPANY_MANAGEMENT,
    icon: 'business',
    backgroundColor: '#636e72',
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
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
    ],
  },
  {
    role: 'INVESTOR',
    moduleTypes: [
      ModuleType.ALL_CHALLENGE,
      ModuleType.FUNDRAISING_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
    ],
  },
  {
    role: 'RECORDER_ADMIN',
    moduleTypes: [
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
    ],
  },
  {
    role: 'RECORDER',
    moduleTypes: [
      ModuleType.CHALLENGE_EXISTING,
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
    ],
  },
  {
    role: 'PLAY_ADMIN',
    moduleTypes: [
      ModuleType.ALL_CHALLENGE,
      ModuleType.ASSIGN_PITCHER_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
    ],
  },
  {
    role: 'PLAYPERSON',
    moduleTypes: [
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
    ],
  },
  {
    role: 'OPERATION_ADMIN',
    moduleTypes: [
      ModuleType.CHANGE_RECORDER_CHALLENGE,
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
    ],
  },
  {
    role: 'OPERATIONPERSON',
    moduleTypes: [
      ModuleType.CHANGE_RECORDER_CHALLENGE,
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
    ],
  },
  {
    role: 'ADMIN',
    moduleTypes: [
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
      ModuleType.CREATE_RACE,
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
      ModuleType.GROUP_MANAGEMENT,
    ],
  },
  {
    role: 'VISITOR',
    moduleTypes: [
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
    ],
  },
  {
    role: 'OUTSIDE',
    moduleTypes: [
      ModuleType.ALL_CHALLENGE,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
    ],
  },
  {
    role: 'GROUP',
    moduleTypes: [
      ModuleType.ALL_RACE,
      ModuleType.RACE_POOL_LIST,
      ModuleType.TURNOVER_QUERY,
      ModuleType.PITCHER_RANKING,
      ModuleType.COMPANY_MANAGEMENT,
    ],
  },
];

// 获取用户可访问的模块列表
export const getUserAccessibleModules = (userRoles: UserRole[] = []): ModuleConfig[] => {
  if (!userRoles || userRoles.length === 0) {
    return [];
  }

  // 获取用户所有角色对应的模块
  const accessibleModuleTypes = new Set<ModuleType>();

  userRoles.forEach((role) => {
    const roleMapping = roleModuleMappings.find((mapping) => mapping.role === role);
    if (roleMapping) {
      roleMapping.moduleTypes.forEach((moduleType) => {
        accessibleModuleTypes.add(moduleType);
      });
    }
  });

  // 返回对应的模块配置
  return moduleConfigs.filter((config) => accessibleModuleTypes.has(config.type));
};
