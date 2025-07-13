export interface GameMatchPlayerDto {
  addressInfoId: number;
  addressName: string;
  gameDate: string;
  id: number;
  matchPlayerDetailDtoList: MatchPlayerDetailDto[];
  name: string;
  playRuleCode: string;
  playRuleName: string;
}

export interface MatchPlayerDetailDto {
  playerName: string;
  playerCode: string | null;
  rate: number;
  type: number;
}
export interface AssignPlayerParams {
  matchId: number;
  playerCode: string;
  rate: number;
  type: number;
}
