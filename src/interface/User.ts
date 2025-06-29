export interface UserParams {
  code: string;
  password: string;
}
export interface UserDetailParams {
  code: string;
  userType: number;
}

export interface ChangePayPasswordParams {
  oldPayPassword: string;
  newPayPassword: string;
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
