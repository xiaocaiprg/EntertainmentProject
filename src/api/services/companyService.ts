import { post } from '../request';
import { CompanyDto, CompanyListParams } from '../../interface/Company';
import { ApiResponse } from '../../interface/IModuleProps';

export const PATH = {
  GET_COMPANY_LIST: 'haiyang/company/list',
};

export const getCompanyList = (params: CompanyListParams): Promise<CompanyDto[] | []> => {
  return post<ApiResponse<CompanyDto[]>>(PATH.GET_COMPANY_LIST, params)
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
