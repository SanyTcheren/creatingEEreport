import { IsString } from 'class-validator';

export class ReportGeneralDto {
	@IsString({ message: 'Не указан тип буровой установки' })
	type: string;

	@IsString({ message: 'Не указан номер буровой установки' })
	number: string;

	@IsString({ message: 'Не указно месторождение' })
	field: string;

	@IsString({ message: 'Не указан куст' })
	bush: string;
}
