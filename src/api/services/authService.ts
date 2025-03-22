import { post } from '../request';
import { UserResult, UserParams } from '../../interface/User';
import { ApiResponse } from '../../interface/IModuleProps';

const PATH = {
  LOGIN: 'haiyang/user/login',
};

// 登录
export const userlogin = (params: UserParams): Promise<UserResult> => {
  return post<ApiResponse<UserResult>>(PATH.LOGIN, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg || '登录失败');
    }
  });
};
