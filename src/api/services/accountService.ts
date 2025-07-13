import { post } from '../request';
import { FixAccountDto, CreateFixAccountParams, TerminateFixAccountParams } from '../../interface/Account';
import { ApiResponse } from '../../interface/IModuleProps';

export const PATH = {
  GET_FIXED_ACCOUNT_LIST: 'haiyang/fixedAccount/list',
  CREATE_FIXED_ACCOUNT: 'haiyang/fixedAccount/create',
  TERMINATE_FIXED_ACCOUNT: 'haiyang/fixedAccount/terminate',
};

export const getFixedAccountList = (): Promise<FixAccountDto[]> => {
  return post<ApiResponse<FixAccountDto[]>>(`${PATH.GET_FIXED_ACCOUNT_LIST}`)
    .then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        throw new Error(res.msg);
      }
    })
    .catch(() => {
      return [];
    });
};
export const createFixedAccount = (params: CreateFixAccountParams): Promise<string> => {
  return post<ApiResponse<string>>(`${PATH.CREATE_FIXED_ACCOUNT}`, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};

export const terminateFixedAccount = (params: TerminateFixAccountParams): Promise<string> => {
  return post<ApiResponse<string>>(`${PATH.TERMINATE_FIXED_ACCOUNT}`, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
