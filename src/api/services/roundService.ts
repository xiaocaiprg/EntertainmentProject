import { post, get } from '../request';
import { RoundCreateParams, GameRoundDto, UpdateStatusParams, GameMatchDto } from '../../interface/Game';
import { ApiResponse } from '../../interface/IModuleProps';

const PATH = {
  ROUND_CREATE: 'haiyang/round/create',
  ROUND_LIST: 'haiyang/round/list',
  ROUND_DETAIL: 'haiyang/round/',
  ROUND_UPDATE: 'haiyang/round/updateStatus',
  ROUND_REMOVE_LAST_INNING: 'haiyang/round/removeLastInning',
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
export const removeLastInning = (roundId: number): Promise<string> => {
  return post<ApiResponse<string>>(PATH.ROUND_REMOVE_LAST_INNING, { id: roundId }).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
