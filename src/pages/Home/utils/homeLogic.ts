import { ModuleConfig, UserRole, RoleModuleMapping, ModuleType } from '../interface/IModuleProps';

// 将后端角色字符串映射到前端UserRole类型
export const mapUserRole = (role?: string): UserRole | undefined => {
  if (!role) {
    return undefined;
  }
  // 根据后端返回的role值映射到前端定义的UserRole
  const roleMap: Record<string, UserRole> = {
    ROLE_INVEST_ADMIN: 'INVESTMENT_MANAGER',
    ROLE_INVESTPERSON: 'INVESTOR',
    ROLE_DOCPERSON: 'RECORDER',
    ROLE_PLAYPERSON: 'OPERATOR',
    ROLE_OPERATIONPERSON: 'PITCHER',
  };
  return roleMap[role] || undefined;
};

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
    moduleTypes: [ModuleType.CHALLENGE_EXISTING, ModuleType.ALL_CHALLENGE],
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
