import { OilWell } from './oilwell';

export class Report {
	private _wells: OilWell[];

	constructor(
		private _type: string,
		private _number: string,
		private _field: string,
		private _bush: string,
	) {
		this._wells = [];
	}

	get type(): string {
		return this._type;
	}
	get number(): string {
		return this._number;
	}
	get field(): string {
		return this._field;
	}
	get bush(): string {
		return this._bush;
	}
	public addWell(well: OilWell): void {
		this._wells.push(well);
	}
}
