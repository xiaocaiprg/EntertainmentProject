export interface TransferPointParams {
  toCode: string;
  toType: number;
  amount: number;
  fromCode?: string;
  fromType?: number;
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

export interface FrozeningDto {
  amount: number;
  gameDate: string;
  id: number;
  name: string;
  currency: string;
  playPersonCode: string;
  playPersonName: string;
  addressName: string;
  addressInfoId: number;
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
  currency: string;
  matchName?: string;
  name?: string;
  profit: number;
  profitStr: string;
}
