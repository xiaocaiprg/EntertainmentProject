export interface ImageInfoDto {
  name: string;
  imageUrl: string;
  type: number;
}
export enum ImageType {
  HOME_PAGE = 1, // 首页轮播
  HOME_BANNER = 2, // 首页banner
  RANK_BANNER = 3, // 排行榜banner
  USER_AVATAR = 4, // 用户头像
}

export interface UploadParams {
  file: any;
}
