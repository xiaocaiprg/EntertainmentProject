import { UserResult } from './User';
import { ContributionDto } from './Contribution';

export interface QueryParams {
  pageNum: number;
  pageSize: number;
}
export interface UserRecordParams extends QueryParams {
  type?: number;
  companyCode?: string;
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

export interface DocCompanyProfitDto {
  companyCode?: string;
  companyName?: string;
  matchId: number;
  profit: number;
  profitStr: string;
}

export interface PersonProfitDto {
  id?: number;
  investPersonCode?: string;
  investPersonName?: string;
  matchId: number;
  profit: number;
  profitStr: string;
}
export interface GameMatchProfitDto {
  docCompanyProfitDtoList?: DocCompanyProfitDto[];
  docCompanyProfit?: number;
  docCompanyProfitStr?: string;
  investCompanyCode?: string;
  investCompanyName?: string;
  investCompanyProfit?: number;
  investCompanyProfitStr?: string;
  operationCompanyCode?: string;
  operationCompanyName?: string;
  operationCompanyProfit?: number;
  operationCompanyProfitStr?: string;
  personProfitDtoList?: PersonProfitDto[];
  playCompanyCode?: string;
  playCompanyName?: string;
  playCompanyProfit?: number;
  playCompanyProfitStr?: string;
}

export interface GameMatchDto {
  addressInfoId?: number;
  addressName?: string;
  availableAmount?: number;
  commissionRate?: number;
  contributedAmount?: number;
  contributionDtoList?: ContributionDto[];
  gameMatchProfitDto?: GameMatchProfitDto;
  createTime?: string;
  docPersonCode?: string;
  docPersonName?: string;
  gameDate?: string;
  id?: number;
  investPersonCode?: string;
  investPersonName?: string;
  isEnabled: number;
  name?: string;
  operationCompanyCode?: string;
  operationCompanyName?: string;
  orderNumber?: number;
  playPersonCode?: string;
  playPersonName?: string;
  baseNumber: number;
  playRuleId?: number;
  principal?: number;
  profit?: number;
  profitStr?: string;
  roundList?: GameRoundDto[];
  turnOver?: number;
  turnOverStr?: string;
}

export interface GameRoundDto {
  addressInfoId?: number;
  addressName?: string;
  createTime?: string;
  docPersonCode?: string;
  docPersonName?: string;
  faultGameInningDtoList?: GameInningDto[];
  gamePointDtoList?: GamePointDto[];
  id: number;
  investPersonCode?: string;
  investPersonName?: string;
  isEnabled: number;
  matchId?: number;
  operationCompanyCode?: string;
  operationCompanyName?: string;
  orderNumber?: number;
  playPersonCode?: string;
  playPersonName?: string;
  profit: number;
  profitStr: string;
  totalProfit: number;
  totalProfitStr: string;
  totalTurnOver: number;
  totalTurnOverStr: string;
  turnOver: number;
  turnOverStr: string;
  gameInningDto: GameInningDto;
  baseNumber: number;
  playRuleId?: number;
}
export interface GamePointDto {
  betNumber: number;
  eventNum: number;
  gameInningDtoList?: GameInningDto[];
}

export interface GameInningDto {
  betNumber?: number;
  createTime?: string;
  docCompanyCode?: string;
  docPersonCode?: string;
  eventNum?: number;
  faultBetNumber?: number;
  id: number;
  isDealer?: number; // 是否庄家：1庄2闲
  matchId?: number;
  orderNumber?: number;
  playCompanyCode?: string;
  playPersonCode?: string;
  result?: number; // 结果：1赢2输
  roundId?: number;
}

export interface ChallengeCreateParams {
  addressInfoId: number;
  contriAmount: number;
  gameDate: string;
  lossLimit?: number;
  name?: string;
  playPersonCode: string;
  principal: number;
  tableNumber?: string;
  baseNumber: number;
  playRuleId?: number;
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

export interface GameTurnOverDtoParams {
  businessCode?: string;
  companyCode?: string;
  endTime: string;
  startTime: string;
}

export interface GameTurnOverDto {
  gameTurnOverItemDtoList?: GameTurnOverItemDto[];
  profit?: number;
  profitStr?: string;
  turnOver?: number;
  turnOverStr?: string;
}

export interface GameTurnOverItemDto {
  addressInfoId?: number;
  addressName?: string;
  gameDate?: string;
  id?: number;
  name?: string;
  profit?: number;
  profitStr?: string;
  turnOver?: number;
  turnOverStr?: string;
}
