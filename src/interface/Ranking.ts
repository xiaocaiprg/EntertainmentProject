export enum RankingTabType {
  HIT_RATE = 'hit_rate',
  KILL_COUNT = 'kill_count',
}

export interface RankSearchParam {
  addressId?: number;
  orderParam?: string;
  pageNum: number;
  pageSize: number;
  rankPeriod: number;
}

export interface PageDto<T> {
  current?: number;
  pages?: number;
  records?: T[];
  size?: number;
  total?: number;
}

export type PageDtoPlayerHitrateRankDto = PageDto<PlayerHitrateRankDto>;
export type PageDtoPlayerKillrateRankDto = PageDto<PlayerKillrateRankDto>;

export interface PlayerHitrateRankDto {
  addressInfoId?: number;
  companyCode?: string;
  companyName?: string;
  hitRate?: number;
  hitRateStr?: string;
  playerCode?: string;
  playerName?: string;
  rankPeriod?: number;
  setDate: string;
  totalInningCount?: number;
  winInningCount?: number;
}

export interface PlayerKillrateRankDto {
  addressInfoId?: number;
  companyCode?: string;
  companyName?: string;
  killRate?: number;
  killRateStr?: string;
  playerCode?: string;
  playerName?: string;
  rankPeriod?: number;
  setDate: string;
  totalInningCount?: number;
  totalProfit?: number;
  totalProfitStr?: string;
  totalTurnOver?: number;
  totalTurnOverStr?: string;
  winInningCount?: number;
}
