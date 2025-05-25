import { post } from '../request';
import { InningCreateParams, GameRoundDto, GameRoundSimpleDto } from '../../interface/Game';
import { ApiResponse } from '../../interface/IModuleProps';

const PATH = {
  INNING_CREATE: 'haiyang/inning/create',
  INNING_DELETE: 'haiyang/inning/delete',
  INNING_UPDATE: 'haiyang/inning/update',
};

export const inningCreate = (params: InningCreateParams): Promise<GameRoundSimpleDto | null> => {
  return post<ApiResponse<GameRoundSimpleDto>>(PATH.INNING_CREATE, params)
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

export const updateInning = (params: InningCreateParams): Promise<GameRoundDto> => {
  return post<ApiResponse<GameRoundDto>>(PATH.INNING_UPDATE, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
