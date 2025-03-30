export interface UserParams {
  code: string;
  password: string;
}
export interface UserResult {
  agentId?: number;
  code?: string;
  createTime?: string;
  id?: number;
  integral?: number;
  name?: string;
  orderNumber?: number;
  password?: string;
  phone?: string;
  role?: string;
  companyCode?: string;
}
