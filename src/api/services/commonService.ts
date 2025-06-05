import { get } from '../request';
import { ImageInfoDto, ImageType } from '../../interface/Universal';
import { ApiResponse } from '../../interface/IModuleProps';

export const PATH = {
  GET_IMAGE_INFO: 'haiyang/imageInfo/',
};

export const getImage = (type: ImageType): Promise<ImageInfoDto[]> => {
  return get<ApiResponse<ImageInfoDto[]>>(`${PATH.GET_IMAGE_INFO}${type}`)
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
