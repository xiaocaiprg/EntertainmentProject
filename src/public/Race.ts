import { RaceStatus } from '../interface/Race';
import i18next from '../i18n';

export const getRaceStatusText = (status: number): { text: string; color: string } => {
  switch (status) {
    case RaceStatus.ENDED:
      return { text: i18next.t('allRace.status.ended'), color: '#999999' };
    case RaceStatus.IN_PROGRESS:
      return { text: i18next.t('allRace.status.inProgress'), color: '#1890ff' };
    default:
      return { text: i18next.t('allRace.status.unknown'), color: '#999999' };
  }
};
