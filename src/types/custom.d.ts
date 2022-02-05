import { OilWell } from '../report/oilwell';

export type Detail = 'drill' | 'prepare';

export interface PowerYearMonth {
	power: number[][];
	year: number;
	month: number;
}

export interface WellPrepareDrill {
	prepare: OilWell | null;
	drill: OilWell | null;
}

export interface keysPrepare {
	prepare: 0;
	drill: 1;
}
