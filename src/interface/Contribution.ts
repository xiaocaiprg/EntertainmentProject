export interface ContributionDto {
  amount: number;
  id: number;
  matchId: number;
  investPersonName: string;
  investPersonCode?: string;
  contriRate?: number;
  contriRateStr?: string;
}

export interface ContributionCreateParams {
  matchId: number;
  amount: number;
  foundSourceType: number; // 1：可用积分，2：额度积分
}
