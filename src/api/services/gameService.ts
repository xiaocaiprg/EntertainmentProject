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
  UpdateStatusParams,
  GameMatchDto,
  PageDtoAddressInfo,
  QueryParams,
  UpdateMatchDocPersonParams,
  GameTurnOverDtoParams,
  GameTurnOverDto,
} from '../../interface/Game';
import { ApiResponse } from '../../interface/IModuleProps';

const PATH = {
  USER_LIST: 'haiyang/business/page',
  ADDRESS_LIST: 'haiyang/addressInfo/page',
  ROUND_CREATE: 'haiyang/round/create',
  ROUND_LIST: 'haiyang/round/list',
  ROUND_DETAIL: 'haiyang/round/',
  ROUND_UPDATE: 'haiyang/round/updateStatus',
  INNING_CREATE: 'haiyang/inning/create',
  INNING_DELETE: 'haiyang/inning/delete',
  MATCH_DETAIL: 'haiyang/match/',
  CHALLENGE_LIST: 'haiyang/match/page',
  CHALLENGE_CREATE: 'haiyang/match/create',
  MATCH_UPDATE_DOC_PERSON: 'haiyang/match/updataDocPerson',
  MATCH_UPDATE_STATUS: 'haiyang/match/updateStatus',
  MATCH_TURNOVER: 'haiyang/match/turnover',
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
export const inningCreate = (params: InningCreateParams): Promise<GameRoundDto | null> => {
  return post<ApiResponse<GameRoundDto>>(PATH.INNING_CREATE, params)
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
  return post<ApiResponse<GameRoundDto[]>>(PATH.ROUND_LIST, { matchId: matchId })
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
export const updateRoundStatus = (params: UpdateStatusParams): Promise<GameMatchDto | null> => {
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
export const updateMatchDocPerson = (params: UpdateMatchDocPersonParams): Promise<string> => {
  return post<ApiResponse<string>>(PATH.MATCH_UPDATE_DOC_PERSON, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
export const updateMatchStatus = (params: UpdateStatusParams): Promise<GameMatchDto | null> => {
  return post<ApiResponse<GameMatchDto>>(PATH.MATCH_UPDATE_STATUS, params)
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
export const deleteInning = (inningId: number): Promise<string> => {
  return post<ApiResponse<string>>(PATH.INNING_DELETE, { id: inningId }).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
export const getMatchTurnOver = (params: GameTurnOverDtoParams): Promise<GameTurnOverDto | null> => {
  return post<ApiResponse<GameTurnOverDto>>(PATH.MATCH_TURNOVER, params)
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
