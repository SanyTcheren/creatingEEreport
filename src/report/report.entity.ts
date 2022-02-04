import { OilWell } from './oilwell';

export class Report {
	private _wells: OilWell[];
	private _dataFile: string;

	constructor(
		private _email: string,
		private _type: string,
		private _number: string,
		private _field: string,
		private _bush: string,
	) {
		this._wells = [];
	}

	get email(): string {
		return this._email;
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
	get wells(): OilWell[] {
		return this._wells;
	}
	get dataFile(): string {
		return this._dataFile;
	}
	public addWell(well: OilWell): void {
		this._wells.push(well);
	}
	public setDataFile(path: string): void {
		this._dataFile = path;
	}
}
