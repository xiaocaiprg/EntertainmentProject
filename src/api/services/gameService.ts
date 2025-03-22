import { post } from '../request';
import {
  RecorderList,
  UserRecordParams,
  ChallengeList,
  QueryParams,
  ChallengeCreateParams,
  RoundCreateParams,
  InningCreateParams,
} from '../../interface/Game';
import { ApiResponse } from '../../interface/IModuleProps';

const PATH = {
  USER_LIST: 'haiyang/user/page',
  CHALLENGE_LIST: 'haiyang/match/page',
  CHALLENGE_CREATE: 'haiyang/match/create',
  ROUND_CREATE: 'haiyang/round/create',
  INNING_CREATE: 'haiyang/inning/create',
};

export const getOperatorList = (params: UserRecordParams): Promise<RecorderList | null> => {
  return post<ApiResponse<RecorderList>>(PATH.USER_LIST, params)
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
export const getChallengeList = (params: QueryParams): Promise<ChallengeList | null> => {
  return post<ApiResponse<ChallengeList>>(PATH.CHALLENGE_LIST, params)
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
export const createChallenge = (params: ChallengeCreateParams): Promise<string> => {
  return post<ApiResponse<string>>(PATH.CHALLENGE_CREATE, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};

export const roundCreate = (params: RoundCreateParams): Promise<string> => {
  return post<ApiResponse<string>>(PATH.ROUND_CREATE, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};

export const inningCreate = (params: InningCreateParams): Promise<string | null> => {
  return post<ApiResponse<string>>(PATH.INNING_CREATE, params)
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
