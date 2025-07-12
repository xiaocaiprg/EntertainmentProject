export interface BusinessListParams {
  code?: string;
  type?: number;
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
export interface BusinessDto {
  availablePoints: number;
  code: string;
  companyCode: string;
  currentInterestRate: number;
  currentInterestRateStr: string;
  currentInterestType: number;
  fixedInterestRate: number;
  fixedInterestRateStr: string;
  fixedInterestType: number;
  frozenPoints: number;
  id: number;
  name: string;
  profit: number;
  profitStr: string;
  role: string;
  totalPoints: number;
  creditAccount: CreditAccountDto;
}
