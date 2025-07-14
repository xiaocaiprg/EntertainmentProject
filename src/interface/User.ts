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
  currentInterestRate: number;
  currentInterestRateStr: string;
  currentInterestType: number;
  fixedInterestRate: number;
  fixedInterestRateStr: string;
  fixedInterestType: number;
  profit: number;
  profitStr: string;
  todayProfit: number;
  todayProfitStr: string;
  role: string;
  totalPoints: number;
  creditAccount: CreditAccountDto;
}

export interface CreditAccountDto {
  availablePoints: number;
  code: string;
  frozenPoints: number;
  name: string;
  repayAmount: number;
  userCode: string;
  userType: number;
}
