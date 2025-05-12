import { get, post } from '../request';
import { CreateRaceParams, PageDtoRacePageDto, PageDtoRacePoolPageDto, RaceDetailDto } from '../../interface/Race';
import { ApiResponse } from '../../interface/IModuleProps';
import { QueryParams } from '../../interface/Common';

export const PATH = {
  CREATE_RACE: 'haiyang/race/create',
  RACE_LIST: 'haiyang/race/page',
  RACE_DETAIL: 'haiyang/race/',
  RACE_POOL_LIST: 'haiyang/racePool/page',
};

export const createRace = (params: CreateRaceParams): Promise<string> => {
  return post<ApiResponse<string>>(PATH.CREATE_RACE, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
export const getRaceList = (params: QueryParams): Promise<PageDtoRacePageDto | null> => {
  return post<ApiResponse<PageDtoRacePageDto>>(PATH.RACE_LIST, params)
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
export const getRaceDetail = (raceId: string): Promise<RaceDetailDto | null> => {
  return get<ApiResponse<RaceDetailDto>>(`${PATH.RACE_DETAIL}${raceId}`)
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
export const getRacePoolList = (params: QueryParams): Promise<PageDtoRacePoolPageDto | null> => {
  return post<ApiResponse<PageDtoRacePoolPageDto>>(PATH.RACE_POOL_LIST, params)
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
