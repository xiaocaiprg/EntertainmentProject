import { post } from '../request';
import { FixAccountDto, CreateFixAccountParams, WithdrawFixAccountParams } from '../../interface/Account';
import { ApiResponse } from '../../interface/IModuleProps';

export const PATH = {
  GET_FIXED_ACCOUNT_LIST: 'haiyang/fixedAccount/list',
  CREATE_FIXED_ACCOUNT: 'haiyang/fixedAccount/create',
  WITHDRAW_FIXED_ACCOUNT: 'haiyang/fixedAccount/withdraw',
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

export const withdrawFixedAccount = (params: WithdrawFixAccountParams): Promise<string> => {
  return post<ApiResponse<string>>(`${PATH.WITHDRAW_FIXED_ACCOUNT}`, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
