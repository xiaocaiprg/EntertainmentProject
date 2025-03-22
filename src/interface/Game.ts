export interface QueryParams {
  pageNum: string;
  pageSize: string;
}
export interface UserRecordParams extends QueryParams {
  type: number;
}
export interface UserRecorder {
  inviteCode: string;
  id: number;
  userId: string;
  username: string;
  password: string;
  phone: string;
  integral: number;
  agentId: number;
  role: string;
}

export interface RecorderList {
  records: UserRecorder[];
  pages: number;
  total: number;
  size: number;
  current: number;
}
export interface ChallengeList {
  current?: number;
  pages?: number;
  records?: GameMatchDto[];
  size?: number;
  total?: number;
}

export interface GameMatchDto {
  address?: string;
  commissionRate?: number;
  docPersonId?: number;
  docPersonName?: string;
  docPersonProfit?: number;
  docPersonProfitStr?: string;
  id?: string;
  investPersonId?: number;
  investPersonName?: string;
  investPersonProfit?: number;
  investPersonProfitStr?: string;
  isEnabled: number;
  name?: string;
  operationPersonId?: number;
  operationPersonName?: string;
  operationPersonProfit?: number;
  operationPersonProfitStr?: string;
  orderNumber?: number;
  playPersonId?: number;
  playPersonName?: string;
  playPersonProfit?: number;
  playPersonProfitStr?: string;
  profit?: number;
  profitStr?: string;
  roundList?: GameRoundDto[];
  tableNumber?: string;
  turnOver?: number;
  turnOverStr?: string;
}

export interface GameRoundDto {
  address?: string;
  docPersonId?: number;
  docPersonName?: string;
  gamePointDtoList?: GamePointDto[];
  id?: number;
  investPersonId?: number;
  investPersonName?: string;
  isEnabled: number;
  matchId?: number;
  operationPersonId?: number;
  operationPersonName?: string;
  orderNumber?: number;
  playPersonId?: number;
  playPersonName?: string;
  profit?: number;
  profitStr?: string;
  tableNumber?: string;
  totalProfit?: number;
  totalProfitStr?: string;
  totalTurnOver?: number;
  totalTurnOverStr?: string;
  turnOver?: number;
  turnOverStr?: string;
}

export interface GamePointDto {
  betNumber?: number;
  eventNum?: number;
  gameInningDtoList?: GameInningDto[];
}

export interface GameInningDto {
  betNumber?: number;
  eventNum?: number;
  id?: number;
  isDealer?: number;
  orderNumber?: number;
  result?: number;
  roundId?: number;
}
