import { get, post } from '../request';
import { UserParams, UserDetailParams, LoginResultDto, ChangePayPasswordParams } from '../../interface/User';
import { ApiResponse } from '../../interface/IModuleProps';
import { BusinessDto } from '../../interface/Business';
import { APP_VERSION_URL } from '../../utils/UpdateManager';

export const PATH = {
  LOGIN: 'haiyang/business/login',
  LOGIN_STATUS: 'haiyang/business/token',
  CHANGE_PASSWORD: 'haiyang/business/password/change',
  CHANGE_PAY_PASSWORD: 'haiyang/business/payPassword/change',
  GET_USER_DETAIL: 'haiyang/business/detail',
};

export const userlogin = (params: UserParams): Promise<BusinessDto> => {
  return post<ApiResponse<BusinessDto>>(PATH.LOGIN, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg || '登录失败');
    }
  });
};

export const getUserStatus = (): Promise<BusinessDto> => {
  return get<ApiResponse<BusinessDto>>(PATH.LOGIN_STATUS).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg || '获取用户信息失败');
    }
  });
};
export const changePassword = (password: string): Promise<string> => {
  return post<ApiResponse<string>>(PATH.CHANGE_PASSWORD, { password }).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
export const getSetting = async (): Promise<any> => {
  try {
    const response = await fetch(APP_VERSION_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取设置失败:', error);
    return null;
  }
};
export const getUserDetail = async (params: UserDetailParams): Promise<LoginResultDto> => {
  return post<ApiResponse<LoginResultDto>>(PATH.GET_USER_DETAIL, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
export const changePayPassword = (params: ChangePayPasswordParams): Promise<string> => {
  return post<ApiResponse<string>>(PATH.CHANGE_PAY_PASSWORD, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
