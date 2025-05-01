import React, { createContext, ReactNode, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../interface/Role';

// 角色上下文接口
export interface RoleContextType {
  userRole?: UserRole;
  isInvestmentManager: boolean;
  isInvestor: boolean;
  isRecorder: boolean;
  isRecorderAdmin: boolean;
  isPlayAdmin: boolean;
  isOperationAdmin: boolean;
  isOperator: boolean;
  isPitcher: boolean;
  isVisitor: boolean;
}

// 创建角色上下文
export const RoleContext = createContext<RoleContextType>({
  userRole: undefined,
  isInvestmentManager: false,
  isInvestor: false,
  isRecorder: false,
  isRecorderAdmin: false,
  isPlayAdmin: false,
  isOperationAdmin: false,
  isOperator: false,
  isPitcher: false,
  isVisitor: false,
});

// 将后端角色字符串映射到前端UserRole类型
export const mapUserRole = (role?: string): UserRole | undefined => {
  if (!role) {
    return undefined;
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
    ROLE_ADMIN: 'ADMIN',
    ROLE_USER: 'USER',
    ROLE_VISITOR: 'VISITOR',
  };
  return roleMap[role] || undefined;
};

// 角色提供者组件属性
interface RoleProviderProps {
  children: ReactNode;
}

// 角色提供者组件
// ROLE_PLAYPERSON：投手公司员工  ROLE_INVESTPERSON:投资人 ROLE_OPERATIONPERSON:娱乐场公司员工ROLE_DOC_ADMIN：记录公司管理员 ROLE_PLAY_ADMIN:投手公司管理员 ROLE_INVEST_ADMIN：投资公司管理员 ROLE_OPERATION_ADMIN:娱乐场公司管理员  ROLE_ADMIN:系统管理员 ROLE_USER:普通用户
export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const { user } = useAuth();

  // 从用户信息获取角色
  const userRole = useMemo(() => mapUserRole(user?.role), [user?.role]);

  // 角色判断辅助方法
  const isInvestmentManager = useMemo(() => userRole === 'INVESTMENT_ADMIN', [userRole]);
  const isInvestor = useMemo(() => userRole === 'INVESTOR', [userRole]);
  const isRecorder = useMemo(() => userRole === 'RECORDER', [userRole]);
  const isOperator = useMemo(() => userRole === 'PLAYPERSON', [userRole]);
  const isPitcher = useMemo(() => userRole === 'OPERATIONPERSON', [userRole]);
  const isRecorderAdmin = useMemo(() => userRole === 'RECORDER_ADMIN', [userRole]);
  const isPlayAdmin = useMemo(() => userRole === 'PLAY_ADMIN', [userRole]);
  const isOperationAdmin = useMemo(() => userRole === 'OPERATION_ADMIN', [userRole]);
  const isVisitor = useMemo(() => userRole === 'VISITOR', [userRole]);

  // 角色上下文值
  const value = {
    userRole,
    isInvestmentManager,
    isInvestor,
    isRecorder,
    isRecorderAdmin,
    isPlayAdmin,
    isOperationAdmin,
    isOperator,
    isPitcher,
    isVisitor,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};
