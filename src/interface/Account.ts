export interface FixAccountDto {
  amount: number;
  code: string;
  isEnabled: number;
  lastInterestDate: string;
  name: string;
  setDate: string;
  userCode: string;
}
export interface CreateFixAccountParams {
  name: string;
  payPassword: string;
  amount: number;
}
export interface WithdrawFixAccountParams {
  code: string;
  amount: number;
  payPassword: string;
}
