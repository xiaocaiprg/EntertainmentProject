export interface PageDtoCompany {
  current?: number;
  pages?: number;
  records?: Company[];
  size?: number;
  total?: number;
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
