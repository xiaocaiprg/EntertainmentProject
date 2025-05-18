import { post } from '../request';
import { QueryParams } from '../../interface/Common';
import { PageDtoTransferLogDto, FrozeningDto, TransferPointParams, PageDtoProfitDto } from '../../interface/Points';
import { ApiResponse } from '../../interface/IModuleProps';

export const PATH = {
  GET_POINT_DETAIL: 'haiyang/detail',
  GET_FROZEN_LIST: 'haiyang/frozen/list',
  TRANSFER_POINT: 'haiyang/transfer',
  GET_PROFIT_LIST: 'haiyang/business/profit/page',
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
