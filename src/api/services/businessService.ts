import { post } from '../request';
import { BusinessDto, BusinessListParams } from '../../interface/Business';
import { ApiResponse } from '../../interface/IModuleProps';

const PATH = {
  GET_BUSINESS_LIST: 'haiyang/business/list',
};

export const getBusinessList = (params: BusinessListParams): Promise<BusinessDto[] | []> => {
  return post<ApiResponse<BusinessDto[]>>(PATH.GET_BUSINESS_LIST, params)
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
