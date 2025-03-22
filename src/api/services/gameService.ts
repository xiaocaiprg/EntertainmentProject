import { post } from '../request';
import { RecorderList, UserRecordParams, ChallengeList, QueryParams } from '../../interface/Game';
import { ApiResponse } from '../../interface/IModuleProps';

const PATH = {
  USER_LIST: 'haiyang/user/page',
  CHALLENGE_LIST: 'haiyang/match/page',
};

export const getOperatorList = (params: UserRecordParams): Promise<RecorderList> => {
  return post<ApiResponse<RecorderList>>(PATH.USER_LIST, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
export const getChallengeList = (params: QueryParams): Promise<ChallengeList> => {
  return post<ApiResponse<ChallengeList>>(PATH.CHALLENGE_LIST, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
