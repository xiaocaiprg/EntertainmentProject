import { post } from '../request';
import { SwitchFinanceParams } from '../../interface/Finance';
import { ApiResponse } from '../../interface/IModuleProps';

const PATH = {
  SWITCH_CURRENT: 'haiyang/finance/current/switch',
};

export const switchFinance = (params: SwitchFinanceParams): Promise<string> => {
  return post<ApiResponse<string>>(PATH.SWITCH_CURRENT, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
