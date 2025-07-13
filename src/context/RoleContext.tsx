import React, { createContext, ReactNode, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../interface/Role';

// 角色上下文接口
export interface RoleContextType {
  userRoles: UserRole[];
  roleString?: string;
  isInvestmentManager: boolean;
  isInvestor: boolean;
  isRecorder: boolean;
  isRecorderAdmin: boolean;
  isPlayAdmin: boolean;
  isOperationAdmin: boolean;
  isRaceAdmin: boolean;
  isOperator: boolean;
  isPitcher: boolean;
  isVisitor: boolean;
  isAdmin: boolean;
  isOutside: boolean;
  isGroup: boolean;
  hasRole: (role: UserRole) => boolean;
}

// 创建角色上下文
export const RoleContext = createContext<RoleContextType>({
  userRoles: [],
  roleString: undefined,
  isInvestmentManager: false,
  isInvestor: false,
  isRecorder: false,
  isRecorderAdmin: false,
  isPlayAdmin: false,
  isOperationAdmin: false,
  isRaceAdmin: false,
  isOperator: false,
  isPitcher: false,
  isVisitor: false,
  isAdmin: false,
  isOutside: false,
  isGroup: false,
  hasRole: () => false,
});

// 将后端角色字符串映射到前端UserRole类型数组
export const mapUserRoles = (roleString?: string): UserRole[] => {
  if (!roleString) {
    return [];
  }

  // 根据后端返回的role值映射到前端定义的UserRole
  const roleMap: Record<string, UserRole> = {
    ROLE_INVEST_ADMIN: 'INVESTMENT_ADMIN',
    ROLE_INVESTPERSON: 'INVESTOR',
    ROLE_DOC_ADMIN: 'RECORDER_ADMIN',
    ROLE_DOCPERSON: 'RECORDER',
    ROLE_PLAY_ADMIN: 'PLAY_ADMIN',
    ROLE_PLAYPERSON: 'PLAYPERSON',
    ROLE_OPERATION_ADMIN: 'OPERATION_ADMIN',
    ROLE_OPERATIONPERSON: 'OPERATIONPERSON',
    ROLE_RACE_ADMIN: 'RACE_ADMIN',
    ROLE_ADMIN: 'ADMIN',
    ROLE_USER: 'USER',
    ROLE_VISITOR: 'VISITOR',
    ROLE_OUTSIDE: 'OUTSIDE',
    ROLE_GROUP: 'GROUP',
  };

  // 分割多个角色并映射
  const roles = roleString.split(',').map((role) => role.trim());
  const mappedRoles: UserRole[] = [];

  roles.forEach((role) => {
    const mappedRole = roleMap[role];
    if (mappedRole && !mappedRoles.includes(mappedRole)) {
      mappedRoles.push(mappedRole);
    }
  });

  return mappedRoles;
};

// 角色提供者组件属性
interface RoleProviderProps {
  children: ReactNode;
}

// 角色提供者组件
// ROLE_PLAYPERSON：投手公司员工  ROLE_INVESTPERSON:投资人 ROLE_OPERATIONPERSON:娱乐场公司员工ROLE_DOC_ADMIN：记录公司管理员 ROLE_PLAY_ADMIN:投手公司管理员 ROLE_INVEST_ADMIN：投资公司管理员 ROLE_OPERATION_ADMIN:娱乐场公司管理员 ROLE_RACE_ADMIN:赛事公司管理员 ROLE_ADMIN:系统管理员 ROLE_USER:普通用户 ROLE_GROUP:组合公司员工
export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { user } = useAuth();

  // 从用户信息获取角色
  const userRoles = useMemo(() => mapUserRoles(user?.role), [user?.role]);
  // 角色判断辅助方法
  const isInvestmentManager = useMemo(() => userRoles.includes('INVESTMENT_ADMIN'), [userRoles]);
  const isInvestor = useMemo(() => userRoles.includes('INVESTOR'), [userRoles]);
  const isRecorder = useMemo(() => userRoles.includes('RECORDER'), [userRoles]);
  const isOperator = useMemo(() => userRoles.includes('PLAYPERSON'), [userRoles]);
  const isPitcher = useMemo(() => userRoles.includes('OPERATIONPERSON'), [userRoles]);
  const isRecorderAdmin = useMemo(() => userRoles.includes('RECORDER_ADMIN'), [userRoles]);
  const isPlayAdmin = useMemo(() => userRoles.includes('PLAY_ADMIN'), [userRoles]);
  const isOperationAdmin = useMemo(() => userRoles.includes('OPERATION_ADMIN'), [userRoles]);
  const isRaceAdmin = useMemo(() => userRoles.includes('RACE_ADMIN'), [userRoles]);
  const isVisitor = useMemo(() => userRoles.includes('VISITOR'), [userRoles]);
  const isAdmin = useMemo(() => userRoles.includes('ADMIN'), [userRoles]);
  const isOutside = useMemo(() => userRoles.includes('OUTSIDE'), [userRoles]);
  const isGroup = useMemo(() => userRoles.includes('GROUP'), [userRoles]);

  // 角色上下文值
  const value = {
    userRoles,
    roleString: user?.role,
    isInvestmentManager,
    isInvestor,
    isRecorder,
    isRecorderAdmin,
    isPlayAdmin,
    isOperationAdmin,
    isRaceAdmin,
    isOperator,
    isPitcher,
    isVisitor,
    isAdmin,
    isOutside,
    isGroup,
    hasRole: (role: UserRole) => userRoles.includes(role),
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};
