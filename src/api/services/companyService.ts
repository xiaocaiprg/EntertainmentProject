import { post } from '../request';
import { UserRecordParams } from '../../interface/Game';
import { PageDtoCompany, CompanyDto, CompanyListParams } from '../../interface/Company';
import { ApiResponse } from '../../interface/IModuleProps';

export const PATH = {
  GET_COMPANY: 'haiyang/company/page',
  GET_COMPANY_LIST: 'haiyang/company/list',
};

export const getCompany = (params: UserRecordParams): Promise<PageDtoCompany | null> => {
  return post<ApiResponse<PageDtoCompany>>(PATH.GET_COMPANY, params)
    .then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        throw new Error(res.msg);
      }
    })
    .catch(() => {
      return null;
    });
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
