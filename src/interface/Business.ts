export interface BusinessListParams {
  code?: string;
  type?: number;
}
export interface BusinessDto {
  availablePoints: number;
  code: string;
  companyCode: string;
  frozenPoints: number;
  id: number;
  name: string;
  profit: number;
  profitStr: string;
  role: string;
  totalPoints: number;
}
