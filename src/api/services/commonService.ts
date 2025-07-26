import { get, post } from '../request';
import { ImageInfoDto, ImageType, UploadParams } from '../../interface/Universal';
import { ApiResponse } from '../../interface/IModuleProps';

export const PATH = {
  GET_IMAGE_INFO: 'haiyang/imageInfo/',
  FILE_UPLOAD: 'haiyang/file/upload',
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
export const fileUpload = (params: UploadParams): Promise<string> => {
  const formData = new FormData();
  // 这里 image 字段必须是 File/Blob 或 { uri, name, type }，不能只是字符串
  // 但如果后端只要字符串，也可以直接 append 字符串
  formData.append('file', params.file);

  return post<ApiResponse<string>>(PATH.FILE_UPLOAD, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((res) => {
    if (res.code === 200) {
      return res.data;
    } else {
      throw new Error(res.msg);
    }
  });
};
