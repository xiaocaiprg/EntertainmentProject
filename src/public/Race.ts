import { RaceStatus } from '../interface/Race';

export const getRaceStatusText = (status: number): { text: string; color: string } => {
  switch (status) {
    case RaceStatus.ENDED:
      return { text: '已结束', color: '#999999' };
    case RaceStatus.IN_PROGRESS:
      return { text: '进行中', color: '#1890ff' };
    default:
      return { text: '未知', color: '#999999' };
  }
};
