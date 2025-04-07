export interface ContributionDto {
  amount: number;
  id: number;
  matchId: number;
  investPersonName: string;
  investPersonCode?: string;
}

export interface ContributionCreateParams {
  matchId: number;
  amount: number;
}
