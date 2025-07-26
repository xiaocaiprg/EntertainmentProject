import { post, get } from '../request';
import {
  ChallengeList,
  ChallengeListParams,
  ChallengeCreateParams,
  UpdateStatusParams,
  GameMatchDto,
  PageDtoAddressInfo,
  UpdateMatchDocPersonParams,
  GameTurnOverDtoParams,
  GameTurnOverDto,
  UpdateMatchContributeTypeParams,
  UploadMatchFileParams,
} from '../../interface/Game';
import { ApiResponse } from '../../interface/IModuleProps';
import { QueryParams } from '../../interface/Common';
const PATH = {
  ADDRESS_LIST: 'haiyang/addressInfo/page',
  MATCH_DETAIL: 'haiyang/match/',
  CHALLENGE_LIST: 'haiyang/match/page',
  CHALLENGE_CREATE: 'haiyang/match/create',
  MATCH_UPDATE_DOC_PERSON: 'haiyang/match/updataDocPerson',
  MATCH_UPDATE_STATUS: 'haiyang/match/updateStatus',
  MATCH_TURNOVER: 'haiyang/match/turnover',
  MATCH_UPDATE_CONTRIBUTE_TYPE: 'haiyang/match/updataContributeType',
  MATCH_UPLOAD_FILE: 'haiyang/match/uploadFile',
};

export const uploadMatchFile = (params: UploadMatchFileParams): Promise<string> => {
  return post<ApiResponse<string>>(PATH.MATCH_UPLOAD_FILE, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
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

export const updateMatchDocPerson = (params: UpdateMatchDocPersonParams): Promise<string> => {
  return post<ApiResponse<string>>(PATH.MATCH_UPDATE_DOC_PERSON, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
export const updateMatchStatus = (params: UpdateStatusParams): Promise<GameMatchDto> => {
  return post<ApiResponse<GameMatchDto>>(PATH.MATCH_UPDATE_STATUS, params).then((res) => {
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
export const updateMatchContributeType = (params: UpdateMatchContributeTypeParams): Promise<string> => {
  return post<ApiResponse<string>>(PATH.MATCH_UPDATE_CONTRIBUTE_TYPE, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
