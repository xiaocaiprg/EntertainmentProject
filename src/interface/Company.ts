export interface PageDtoCompany {
  current?: number;
  pages?: number;
  records?: Company[];
  size?: number;
  total?: number;
}

export interface CompanyListParams {
  type?: number;
  code?: string;
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
