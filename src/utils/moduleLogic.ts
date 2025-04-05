import { ModuleConfig, UserRole, RoleModuleMapping, ModuleType } from '../interface/Role';

// 定义所有可用模块
export const availableModules: ModuleConfig[] = [
  {
    id: '1',
    title: '发起挑战',
    type: ModuleType.CHALLENGE_NEW,
    icon: 'add-circle',
    backgroundColor: '#6c5ce7',
  },
  {
    id: '2',
    title: '查询已有挑战',
    type: ModuleType.CHALLENGE_EXISTING,
    icon: 'history',
    backgroundColor: '#00b894',
  },
  {
    id: '3',
    title: '所有挑战列表',
    type: ModuleType.ALL_CHALLENGE,
    icon: 'list',
    backgroundColor: '#e17055',
  },
  {
    id: '4',
    title: '更新记录人',
    type: ModuleType.COMPLETED_FUNDING_CHALLENGE,
    icon: 'check-circle',
    backgroundColor: '#fdcb6e',
  },
];

// 定义角色到模块的映射
export const roleModuleMappings: RoleModuleMapping[] = [
  {
    role: 'INVESTMENT_MANAGER',
    moduleTypes: [ModuleType.CHALLENGE_NEW, ModuleType.ALL_CHALLENGE],
  },
  {
    role: 'INVESTOR',
    moduleTypes: [ModuleType.ALL_CHALLENGE],
  },
  {
    role: 'RECORDER',
    moduleTypes: [ModuleType.CHALLENGE_EXISTING, ModuleType.ALL_CHALLENGE],
  },
  {
    role: 'OPERATOR',
    moduleTypes: [ModuleType.ALL_CHALLENGE],
  },
  {
    role: 'PITCHER',
    moduleTypes: [ModuleType.COMPLETED_FUNDING_CHALLENGE, ModuleType.ALL_CHALLENGE],
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
