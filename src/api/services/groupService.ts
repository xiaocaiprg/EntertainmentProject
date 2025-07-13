import { post } from '../request';
import { GroupCompanyDto } from '../../interface/Group';
import { ApiResponse } from '../../interface/IModuleProps';

const PATH = {
  GET_GROUP_LIST: 'haiyang/group/list',
};

export const getGroupList = (): Promise<GroupCompanyDto[] | []> => {
  return post<ApiResponse<GroupCompanyDto[]>>(PATH.GET_GROUP_LIST)
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
