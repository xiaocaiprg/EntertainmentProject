export interface UserParams {
  code: string;
  password: string;
}
export interface UserDetailParams {
  code: string;
  type: number;
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
export interface LoginResultDto {
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
