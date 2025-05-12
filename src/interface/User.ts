export interface UserParams {
  code: string;
  password: string;
}
export interface UserResult {
  code: string;
  id?: number;
  name?: string;
  role?: string;
  companyCode?: string;
  availablePoints: number;
  frozenPoints: number;
  totalPoints: number;
  profit: number;
  profitStr: string;
}
