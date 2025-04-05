import { useContext } from 'react';
import { RoleContext } from '../context/RoleContext';

/**
 * 使用角色的自定义Hook
 * 提供用户角色及角色类型判断功能
 */
export const useRole = () => useContext(RoleContext);
