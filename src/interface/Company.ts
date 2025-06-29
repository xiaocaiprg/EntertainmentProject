export interface CompanyListParams {
  type?: number;
  code?: string;
  isSelf?: number;
}

export interface Company {
  code: string;
  createTime?: string;
  id?: number;
  integral?: number;
  name?: string;
  orderNumber?: number;
  phone?: string;
}

export interface CompanyDto {
  availablePoints: number;
  code: string;
  currentInterestRate: number;
  currentInterestRateStr: string;
  currentInterestType: number;
  fixedInterestRate: number;
  fixedInterestRateStr: string;
  fixedInterestType: number;
  frozenPoints: number;
  groupCode: string;
  groupName: string;
  id: number;
  name: string;
  profit: number;
  profitStr: string;
  role: string;
  totalPoints: number;
  type: number;
}
