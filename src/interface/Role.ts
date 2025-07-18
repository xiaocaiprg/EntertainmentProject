// 用户角色类型定义
export type UserRole =
  | 'INVESTMENT_ADMIN'
  | 'INVESTOR'
  | 'RECORDER'
  | 'PLAYPERSON'
  | 'OPERATIONPERSON'
  | 'RECORDER_ADMIN'
  | 'PLAY_ADMIN'
  | 'OPERATION_ADMIN'
  | 'RACE_ADMIN'
  | 'ADMIN'
  | 'USER'
  | 'VISITOR'
  | 'OUTSIDE'
  | 'GROUP';

// 模块类型定义
export enum ModuleType {
  CHALLENGE_NEW = 'challenge_new',
  CHALLENGE_EXISTING = 'challenge_existing',
  ALL_CHALLENGE = 'all_challenge',
  CHANGE_RECORDER_CHALLENGE = 'change_recorder_challenge',
  FUNDRAISING_CHALLENGE = 'fundraising_challenge',
  ASSIGN_PITCHER_CHALLENGE = 'assign_pitcher_challenge',
  TURNOVER_QUERY = 'turnover_query',
  PITCHER_RANKING = 'player_ranking',
  CREATE_RACE = 'create_race',
  ALL_RACE = 'all_race',
  RACE_POOL_LIST = 'race_pool_list',
  GROUP_MANAGEMENT = 'group_management',
  COMPANY_MANAGEMENT = 'company_management',
}

// 模块配置类型定义
export interface ModuleConfig {
  id: string;
  title: string;
  type: ModuleType;
  icon: string;
  backgroundColor: string;
}

// 角色到模块的映射配置
export interface RoleModuleMapping {
  role: UserRole;
  moduleTypes: ModuleType[];
}
