import { get, post } from '../request';
import { GameMatchPlayerDto, AssignPlayerParams } from '../../interface/Player';
import { ApiResponse } from '../../interface/IModuleProps';

export const PATH = {
  GET_PLAYER: 'haiyang/matchplayer/',
  ASSIGN_PLAYER: 'haiyang/matchplayer/create',
};

export const getPlayer = (id: string): Promise<GameMatchPlayerDto | null> => {
  return get<ApiResponse<GameMatchPlayerDto>>(`${PATH.GET_PLAYER}${id}`)
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
export const assignPlayer = (params: AssignPlayerParams[]): Promise<string> => {
  return post<ApiResponse<string>>(PATH.ASSIGN_PLAYER, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
