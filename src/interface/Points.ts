export interface TransferPointParams {
  toCode: string;
  toType: number;
  amount: number;
}
export interface PageDtoTransferLogDto {
  current: number;
  pages: number;
  records?: TransferLogDto[];
  size: number;
  total: number;
}

export interface TransferLogDto {
  amount?: number;
  transferTime?: string;
  fromCode?: string;
  fromName?: string;
  fromType?: number;
  id?: number;
  matchId: number;
  matchName: string;
  toCode?: string;
  toName?: string;
  toType?: number;
  type?: number;
}

export interface GameMatch {
  addressInfoId?: number;
  baseNumber?: number;
  commissionRate?: number;
  createTime?: string;
  docPersonCode?: string;
  gameDate?: string;
  id?: number;
  investPersonCode?: string;
  isEnabled?: number;
  name?: string;
  operationCompanyCode?: string;
  orderNumber?: number;
  playPersonCode?: string;
  playRuleCode?: string;
  principal?: number;
  profit?: number;
  turnOver?: number;
}

export interface PageDtoProfitDto {
  current: number;
  pages: number;
  records?: ProfitDto[];
  size: number;
  total: number;
}

export interface ProfitDto {
  code?: string;
  matchId: number;
  matchName?: string;
  name?: string;
  profit: number;
  profitStr: string;
}
