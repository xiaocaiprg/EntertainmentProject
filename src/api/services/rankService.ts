import { post } from '../request';
import { ApiResponse } from '../../interface/IModuleProps';
import { RankSearchParam, PageDtoPlayerHitrateRankDto, PageDtoPlayerKillrateRankDto } from '../../interface/Ranking';

export const PATH = {
  PITCHER_RANK_HITRATE: 'haiyang/statistic/player/rank/hitrate',
  PITCHER_RANK_KILLRATE: 'haiyang/statistic/player/rank/killrate',
};

export const getPitcherRankingHitRate = (params: RankSearchParam): Promise<PageDtoPlayerHitrateRankDto | null> => {
  return post<ApiResponse<PageDtoPlayerHitrateRankDto>>(PATH.PITCHER_RANK_HITRATE, params)
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

export const getPitcherRankingKillRate = (params: RankSearchParam): Promise<PageDtoPlayerKillrateRankDto | null> => {
  return post<ApiResponse<PageDtoPlayerKillrateRankDto>>(PATH.PITCHER_RANK_KILLRATE, params)
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
