import { post } from '../request';
import { CreateRaceParams } from '../../interface/Race';
import { ApiResponse } from '../../interface/IModuleProps';

export const PATH = {
  CREATE_RACE: 'haiyang/race/create',
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
