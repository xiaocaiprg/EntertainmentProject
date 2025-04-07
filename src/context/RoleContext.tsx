import React, { createContext, ReactNode, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../interface/Role';

// 角色上下文接口
export interface RoleContextType {
  userRole?: UserRole;
  isInvestmentManager: boolean;
  isInvestor: boolean;
  isRecorder: boolean;
  isOperator: boolean;
  isPitcher: boolean;
}

// 创建角色上下文
export const RoleContext = createContext<RoleContextType>({
  userRole: undefined,
  isInvestmentManager: false,
  isInvestor: false,
  isRecorder: false,
  isOperator: false,
  isPitcher: false,
});

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

// 角色提供者组件属性
interface RoleProviderProps {
  children: ReactNode;
}

// 角色提供者组件
export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { user } = useAuth();

  // 从用户信息获取角色
  const userRole = useMemo(() => mapUserRole(user?.role), [user?.role]);

  // 角色判断辅助方法
  const isInvestmentManager = useMemo(() => userRole === 'INVESTMENT_MANAGER', [userRole]);
  const isInvestor = useMemo(() => userRole === 'INVESTOR', [userRole]);
  const isRecorder = useMemo(() => userRole === 'RECORDER', [userRole]);
  const isOperator = useMemo(() => userRole === 'OPERATOR', [userRole]);
  const isPitcher = useMemo(() => userRole === 'PITCHER', [userRole]);

  // 角色上下文值
  const value = {
    userRole,
    isInvestmentManager,
    isInvestor,
    isRecorder,
    isOperator,
    isPitcher,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};
