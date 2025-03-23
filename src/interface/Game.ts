export interface QueryParams {
  pageNum: string;
  pageSize: string;
}
export interface UserRecordParams extends QueryParams {
  type: number;
}
export interface ChallengeListParams extends QueryParams {
  isEnabled?: number;
}
export interface UserRecorder {
  inviteCode: string;
  id: number;
  userId: number;
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
  current: number;
  pages: number;
  records?: GameMatchDto[];
  size: number;
  total: number;
}

export interface GameMatchDto {
  address?: string;
  commissionRate?: number;
  docPersonId?: number;
  docPersonName?: string;
  docPersonProfit?: number;
  docPersonProfitStr?: string;
  id?: number;
  investPersonId?: number;
  investPersonName?: string;
  investPersonProfit?: number;
  investPersonProfitStr?: string;
  isEnabled: number;
  name?: string;
  createTime?: string;
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
  createTime?: string;
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
  profitStr?: string; // 上下水
  tableNumber?: string;
  totalProfit?: number;
  totalProfitStr?: string;
  totalTurnOver?: number;
  totalTurnOverStr?: string;
  turnOver?: number; // 转码
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
  createTime?: string;
  id?: number;
  isDealer?: number; // 是否庄家：1庄2闲
  orderNumber?: number;
  result?: number; // 结果：1赢2输
  roundId?: number;
}

export interface ChallengeCreateParams {
  address?: string;
  docPersonId?: number;
  id?: number;
  investPersonId?: number;
  isEnabled: number; //1开启 0结束
  name: string;
  operationPersonId?: number;
  orderNumber?: number;
  playPersonId: number;
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

export interface UpdateRoundStatusParams {
  id: number;
  isEnabled: number;
}
