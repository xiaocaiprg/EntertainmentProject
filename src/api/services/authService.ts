import { get, post } from '../request';
import { UserResult, UserParams } from '../../interface/User';
import { ApiResponse } from '../../interface/IModuleProps';

export const PATH = {
  LOGIN: 'haiyang/business/login',
  LOGIN_STATUS: 'haiyang/business/token',
};

export const userlogin = (params: UserParams): Promise<UserResult> => {
  return post<ApiResponse<UserResult>>(PATH.LOGIN, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg || '登录失败');
    }
  });
};

export const getUserStatus = (): Promise<UserResult> => {
  return get<ApiResponse<UserResult>>(PATH.LOGIN_STATUS).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg || '获取用户信息失败');
    }
  });
};
