import { get, post } from '../request';
import { ContributionCreateParams, ContributionDto } from '../../interface/Contribution';
import { ApiResponse } from '../../interface/IModuleProps';

const PATH = {
  CONTRIBUTION_CREATE: 'haiyang/contribution/create',
  CONTRIBUTION_MATCH_DETAIL: 'haiyang/contribution/match/',
  CONTRIBUTION_DELETE: 'haiyang/contribution/delete',
};

export const createContribution = (params: ContributionCreateParams): Promise<ContributionDto | null> => {
  return post<ApiResponse<ContributionDto>>(PATH.CONTRIBUTION_CREATE, params)
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

export const getContributionDetail = (matchId: number): Promise<ContributionDto | null> => {
  return get<ApiResponse<ContributionDto>>(`${PATH.CONTRIBUTION_MATCH_DETAIL}${matchId}`)
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

export const deleteContribution = (id: number): Promise<number | null> => {
  return post<ApiResponse<number>>(PATH.CONTRIBUTION_DELETE, { id: id })
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
