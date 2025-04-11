import { ChallengeStatus } from '../interface/Common';
export const getStatusText = (status: number): { text: string; color: string } => {
  switch (status) {
    case ChallengeStatus.ENDED:
      return { text: '已结束', color: '#999999' };
    case ChallengeStatus.IN_PROGRESS:
      return { text: '进行中', color: '#1890ff' };
    case ChallengeStatus.FUNDRAISING:
      return { text: '募资中', color: '#52c41a' };
    case ChallengeStatus.FUNDRAISING_COMPLETED:
      return { text: '募资完成', color: '#faad14' };
    case ChallengeStatus.COMPLETED:
      return { text: '已完成', color: '#722ed1' };
    default:
      return { text: '未知', color: '#999999' };
  }
};
