import moment, { Moment } from 'moment';
import { Detail } from '../types/custom';

export class OilWell {
	private _start: Moment;
	private _end: Moment;

	constructor(
		private readonly _well: string,
		private readonly _deatil: Detail,
		start: string,
		end: string,
	) {
		this._start = moment(start);
		this._end = moment(end);
	}
	get well(): string {
		return this._well;
	}
	get detail(): string {
		return this._deatil;
	}
	get start(): string {
		return this._start.format('DD.MM.YYYY HH:mm');
	}
	get end(): string {
		return this._end.format('DD.MM.YYYY HH:mm');
	}
}
