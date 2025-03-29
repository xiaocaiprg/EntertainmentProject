import { post, get } from '../request';
import {
  RecorderList,
  UserRecordParams,
  ChallengeList,
  ChallengeListParams,
  ChallengeCreateParams,
  RoundCreateParams,
  InningCreateParams,
  GameRoundDto,
  UpdateRoundStatusParams,
  GameMatchDto,
  PageDtoAddressInfo,
  QueryParams,
} from '../../interface/Game';
import { ApiResponse } from '../../interface/IModuleProps';

const PATH = {
  USER_LIST: 'haiyang/business/page',
  CHALLENGE_LIST: 'haiyang/match/page',
  CHALLENGE_CREATE: 'haiyang/match/create',
  ROUND_CREATE: 'haiyang/round/create',
  INNING_CREATE: 'haiyang/inning/create',
  ROUND_LIST: 'haiyang/round/list',
  ROUND_DETAIL: 'haiyang/round/',
  ROUND_UPDATE: 'haiyang/round/updateStatus',
  MATCH_DETAIL: 'haiyang/match/',
  ADDRESS_LIST: 'haiyang/addressInfo/page',
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
export const getChallengeList = (params: ChallengeListParams): Promise<ChallengeList | null> => {
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
export const getRoundList = (matchId: number): Promise<GameRoundDto[] | null> => {
  return post<ApiResponse<GameRoundDto[]>>(PATH.ROUND_LIST, { matchId })
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
export const getRoundDetail = (roundId: number): Promise<GameRoundDto | null> => {
  return get<ApiResponse<GameRoundDto>>(`${PATH.ROUND_DETAIL}${roundId}`)
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
export const updateRoundStatus = (params: UpdateRoundStatusParams): Promise<GameMatchDto | null> => {
  return post<ApiResponse<GameMatchDto>>(PATH.ROUND_UPDATE, params)
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
export const getMatchDetail = (matchId: number): Promise<GameMatchDto | null> => {
  return get<ApiResponse<GameMatchDto>>(`${PATH.MATCH_DETAIL}${matchId}`)
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

// 获取地点列表
export const getAddressList = (params: QueryParams): Promise<PageDtoAddressInfo | null> => {
  return post<ApiResponse<PageDtoAddressInfo>>(PATH.ADDRESS_LIST, params)
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

// 获取记录人列表
export const getRecorderList = (params: UserRecordParams): Promise<RecorderList | null> => {
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
