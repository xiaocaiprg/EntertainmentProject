export enum RankingTabType {
  HIT_RATE = 'hit_rate',
  KILL_COUNT = 'kill_count',
  PERSONAL = 'personal',
  COMBINATION = 'combination',
}

export enum RankingTypeEnum {
  COMPANY = 'company',
  PERSONAL = 'personal',
}

export interface RankCompanySearchParam {
  addressId?: number;
  orderParam?: string;
  rankPeriod: number;
}
export interface RankSearchParam {
  addressId?: number;
  orderParam?: string;
  pageNum: number;
  pageSize: number;
  rankPeriod: number;
  playType: number;
}

export interface PageDto<T> {
  current: number;
  pages: number;
  records?: T[];
  size: number;
  total: number;
}

export type PageDtoPlayerHitrateRankDto = PageDto<PlayerHitrateRankDto>;
export type PageDtoPlayerKillrateRankDto = PageDto<PlayerKillrateRankDto>;
export type PageDtoPlayerCompanyKillrateRankDto = PlayerCompanyKillrateRankDto[];
export type PageDtoPlayerCompanyHitrateRankDto = PlayerCompanyHitrateRankDto[];

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

export interface PlayerCompanyKillrateRankDto {
  companyCode?: string;
  companyName?: string;
  killRate?: number;
  killRateStr?: string;
  rankPeriod?: number;
  setDate: string;
  totalInningCount?: number;
  totalProfit?: number;
  totalProfitStr?: string;
  totalTurnOver?: number;
  totalTurnOverStr?: string;
  winInningCount?: number;
}

export interface PlayerCompanyHitrateRankDto {
  companyCode?: string;
  companyName?: string;
  hitRate?: number;
  hitRateStr?: string;
  rankPeriod?: number;
  setDate: string;
  totalInningCount?: number;
  winInningCount?: number;
}
export interface PeakRecordDto {
  maxInningCountMatch: GameMatchSimpleDto;
  maxProfitMatch: GameMatchSimpleDto;
}
export interface GameMatchSimpleDto {
  addressInfoId: number;
  addressName: string;
  baseNumber: number;
  count: number;
  docPersonCode: string;
  docPersonName: string;
  gameDate: string;
  id: number;
  currency: string;
  isEnabled: number;
  name: string;
  playPersonCode: string;
  playPersonName: string;
  playRuleCode: string;
  playRuleName: string;
  principal: number;
  profit: number;
  profitStr: string;
  raceId: number;
  raceName: string;
  turnOver: number;
  turnOverStr: string;
}
