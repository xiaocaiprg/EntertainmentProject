import { get, post } from '../request';
import { QueryParams } from '../../interface/Common';
import {
  PageDtoTransferLogDto,
  FrozeningDto,
  TransferPointParams,
  PageDtoProfitDto,
  TransferOutLogDto,
  TransferCreditPointParams,
} from '../../interface/Points';
import { ApiResponse } from '../../interface/IModuleProps';

export const PATH = {
  GET_POINT_DETAIL: 'haiyang/detail',
  GET_FROZEN_LIST: 'haiyang/frozen/list',
  TRANSFER_POINT: 'haiyang/transfer',
  GET_PROFIT_LIST: 'haiyang/business/profit/page',
  TURNOVER_PROCESS: 'haiyang/turnover/process',
  GET_TRANSFER_OUTLOG_LIST: 'haiyang/transfer/outlog/list/',
  TRANSFER_CREDIT_POINT: 'haiyang/transferCreditPoint',
  PRE_REPAY: 'haiyang/creditAccount/preRepaySystemSecuredLoan',
};

export const getPointDetail = (params: QueryParams): Promise<PageDtoTransferLogDto | null> => {
  return post<ApiResponse<PageDtoTransferLogDto>>(PATH.GET_POINT_DETAIL, params)
    .then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        throw new Error(res.msg);
      }
    })
    .catch(() => {
      return null;
    });
};
export const getFrozenList = (): Promise<FrozeningDto[] | null> => {
  return post<ApiResponse<FrozeningDto[]>>(PATH.GET_FROZEN_LIST)
    .then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        throw new Error(res.msg);
      }
    })
    .catch(() => {
      return null;
    });
};
export const transferPoint = (params: TransferPointParams): Promise<string> => {
  return post<ApiResponse<string>>(PATH.TRANSFER_POINT, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
export const getProfitList = (params: QueryParams): Promise<PageDtoProfitDto | null> => {
  return post<ApiResponse<PageDtoProfitDto>>(PATH.GET_PROFIT_LIST, params)
    .then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        throw new Error(res.msg);
      }
    })
    .catch(() => {
      return null;
    });
};
export const turnoverProcess = (): Promise<string> => {
  return post<ApiResponse<string>>(PATH.TURNOVER_PROCESS).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
export const getTransferOutlogList = (toType: string): Promise<TransferOutLogDto[] | []> => {
  return get<ApiResponse<TransferOutLogDto[]>>(`${PATH.GET_TRANSFER_OUTLOG_LIST}${toType}`)
    .then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        throw new Error(res.msg);
      }
    })
    .catch(() => {
      return [];
    });
};
export const transferCreditPoint = (params: TransferCreditPointParams): Promise<string> => {
  return post<ApiResponse<string>>(PATH.TRANSFER_CREDIT_POINT, params).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
export const preRepay = (payPassword: string): Promise<string> => {
  return post<ApiResponse<string>>(PATH.PRE_REPAY, { payPassword }).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
