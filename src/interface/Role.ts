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
  | 'ADMIN'
  | 'USER';

// 模块类型定义
export enum ModuleType {
  CHALLENGE_NEW = 'challenge_new',
  CHALLENGE_EXISTING = 'challenge_existing',
  ALL_CHALLENGE = 'all_challenge',
  COMPLETED_FUNDING_CHALLENGE = 'completed_funding_challenge',
  FUNDRAISING_CHALLENGE = 'fundraising_challenge',
  TURNOVER_QUERY = 'turnover_query',
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
