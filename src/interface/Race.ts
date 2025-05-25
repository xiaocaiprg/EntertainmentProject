import { QueryParams } from './Common';
import { GameMatchSimpleDto, PeakRecordDto } from './Ranking';

export interface CreateRaceParams {
  beginDate: string;
  description?: string;
  endDate: string;
  name: string;
  playRuleCode?: string;
  turnOverLimit?: number;
}
export interface CreateRacePoolParams {
  name: string;
  description?: string;
}

// 比赛状态枚举
export enum RaceStatus {
  ENDED = 0, // 已结束
  IN_PROGRESS = 1, // 进行中
  ALL = -1, // 全部
}

export enum RacePoolStatus {
  ENABLED = 1, // 开启
  DISABLED = 0, // 关闭
}
// 比赛列表查询参数
export interface RaceListParams extends QueryParams {
  isEnabledList?: number[];
}

export interface PageDtoRacePageDto {
  current: number;
  pages: number;
  records?: RacePageDto[];
  size?: number;
  total?: number;
}

export interface RacePageDto {
  beginDate: string;
  description?: string;
  endDate: string;
  id?: number;
  isEnabled?: number;
  name: string;
  playRuleCode?: string;
  playRuleName?: string;
  turnOverLimit?: number;
}
export interface RaceDetailDto {
  beginDate: string;
  description?: string;
  endDate: string;
  id?: number;
  isEnabled?: number;
  name: string;
  playRuleCode?: string;
  playRuleName?: string;
  racePoolDetailDto?: RacePoolPageDto;
  turnOverLimit?: number;
  gameMatchSimpleDtoList?: GameMatchSimpleDto[];
  peakRecordDto?: PeakRecordDto;
}
export interface RacePoolPageDto {
  id?: number;
  availablePoints?: number;
  code?: string;
  frozenPoints?: number;
  name?: string;
  raceId?: number;
  raceName?: string;
  totalPoints?: number;
  isEnabled?: number;
}
export interface PageDtoRacePoolPageDto {
  current: number;
  pages: number;
  records?: RacePoolPageDto[];
  size?: number;
  total?: number;
}
