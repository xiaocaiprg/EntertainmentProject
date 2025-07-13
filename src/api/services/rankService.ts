import { post } from '../request';
import { ApiResponse } from '../../interface/IModuleProps';
import {
  RankSearchParam,
  PageDtoPlayerHitrateRankDto,
  PageDtoPlayerKillrateRankDto,
  RankCompanySearchParam,
  PageDtoPlayerCompanyKillrateRankDto,
  PageDtoPlayerCompanyHitrateRankDto,
  PeakRecordDto,
  AddressKillrateRankDto,
} from '../../interface/Ranking';

export const PATH = {
  PITCHER_RANK_HITRATE: 'haiyang/statistic/play/rank/hitrate',
  PITCHER_RANK_KILLRATE: 'haiyang/statistic/play/rank/killrate',
  PITCHER_RANK_HITRATE_COMPANY: 'haiyang/statistic/company/play/rank/hitrate',
  PITCHER_RANK_KILLRATE_COMPANY: 'haiyang/statistic/company/play/rank/killrate',
  PITCHER_RANK_PEAK: 'haiyang/statistic/record/peak',
  PITCHER_RANK_ADDRESS_KILLRATE: 'haiyang/statistic/address/rank/killrate',
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

export const getPitcherRankingHitRateCompany = (
  params: RankCompanySearchParam,
): Promise<PageDtoPlayerCompanyHitrateRankDto | null> => {
  return post<ApiResponse<PageDtoPlayerCompanyHitrateRankDto>>(PATH.PITCHER_RANK_HITRATE_COMPANY, params)
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
export const getPitcherRankingKillRateCompany = (
  params: RankCompanySearchParam,
): Promise<PageDtoPlayerCompanyKillrateRankDto | null> => {
  return post<ApiResponse<PageDtoPlayerCompanyKillrateRankDto>>(PATH.PITCHER_RANK_KILLRATE_COMPANY, params)
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
export const getRecordPeak = (raceId?: number): Promise<PeakRecordDto | null> => {
  return post<ApiResponse<PeakRecordDto>>(PATH.PITCHER_RANK_PEAK, { raceId })
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
export const getAddressKillRate = (params: RankCompanySearchParam): Promise<AddressKillrateRankDto[] | []> => {
  return post<ApiResponse<AddressKillrateRankDto[]>>(PATH.PITCHER_RANK_ADDRESS_KILLRATE, params)
    .then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        throw new Error(res.msg);
      }
    })
    .catch(() => {
      return [];
    });
};
