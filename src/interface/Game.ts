import { UserResult } from './User';

export interface QueryParams {
  pageNum: string;
  pageSize: string;
}
export interface UserRecordParams extends QueryParams {
  type: number;
}
export interface ChallengeListParams extends QueryParams {
  isEnabledList?: number[];
}

export interface RecorderList {
  records: UserResult[];
  pages: number;
  total: number;
  size: number;
  current: number;
}
export interface ChallengeList {
  current: number;
  pages: number;
  records?: GameMatchDto[];
  size: number;
  total: number;
}

export interface GameMatchDto {
  addressInfoId?: number;
  addressName?: string;
  commissionRate?: number;
  createTime?: string;
  docPersonCode?: string;
  docPersonName?: string;
  docPersonProfit?: number;
  docPersonProfitStr?: string;
  gameDate?: string;
  id?: number;
  investPersonCode?: string;
  investPersonName?: string;
  investPersonProfit?: number;
  investPersonProfitStr?: string;
  isEnabled: number;
  lossLimit?: number;
  name?: string;
  operationPersonCode?: string;
  operationPersonName?: string;
  operationPersonProfit?: number;
  operationPersonProfitStr?: string;
  orderNumber?: number;
  playPersonCode?: string;
  playPersonName?: string;
  playPersonProfit?: number;
  playPersonProfitStr?: string;
  principal?: number;
  profit?: number;
  profitStr?: string;
  roundList?: GameRoundDto[];
  tableNumber?: string;
  turnOver?: number;
  turnOverStr?: string;
}

export interface GameRoundDto {
  addressInfoId?: number;
  addressName?: string;
  createTime?: string;
  docPersonCode?: string;
  docPersonName?: string;
  gamePointDtoList?: GamePointDto[];
  id: number;
  investPersonCode?: string;
  investPersonName?: string;
  isEnabled: number;
  matchId?: number;
  operationPersonCode?: string;
  operationPersonName?: string;
  orderNumber?: number;
  playPersonCode?: string;
  playPersonName?: string;
  profit: number;
  profitStr: string;
  tableNumber?: string;
  totalProfit: number;
  totalProfitStr: string;
  totalTurnOver: number;
  totalTurnOverStr: string;
  turnOver: number;
  turnOverStr: string;
  gameInningDto: GameInningDto;
}
export interface GamePointDto {
  betNumber: number;
  eventNum: number;
  gameInningDtoList?: GameInningDto[];
}

export interface GameInningDto {
  betNumber?: number;
  createTime?: string;
  eventNum?: number;
  id: number;
  isDealer?: number; // 是否庄家：1庄2闲
  orderNumber?: number;
  result?: number; // 结果：1赢2输
  roundId?: number;
}

export interface ChallengeCreateParams {
  addressInfoId?: number;
  contriAmount?: number;
  gameDate?: string;
  lossLimit?: number;
  name?: string;
  operationPersonCode?: string;
  playPersonCode: string;
  principal: number;
  tableNumber?: string;
}

export interface RoundCreateParams {
  matchId: number;
}

export interface InningCreateParams {
  betNumber?: number;
  eventNum?: number;
  id?: number;
  isDealer?: number;
  orderNumber?: number;
  result?: number;
  roundId?: number;
}

export interface UpdateStatusParams {
  id: number;
  isEnabled: number;
}

export interface PageDtoAddressInfo {
  current?: number;
  pages?: number;
  records?: AddressInfo[];
  size?: number;
  total?: number;
}

export interface AddressInfo {
  code?: string;
  companyCode?: string;
  createTime?: string;
  id?: number;
  name?: string;
  orderNumber?: number;
  phone?: string;
  position?: string;
}
export interface UpdateMatchDocPersonParams {
  id: number; // 挑战id
  docPersonCode: string;
}
