import { Company } from '../../../interface/Company';
import { GameTurnOverDto } from '../../../interface/Game';

export interface QueryCondition {
  startTime: string;
  endTime: string;
  companyCode?: string;
  businessCode?: string;
  userType?: number;
}

export interface FilterProps {
  onSearch: (params: QueryCondition) => void;
  companyList: Company[];
  currentUserType: number;
}

export interface ResultListProps {
  loading: boolean;
  data: GameTurnOverDto | null;
}
