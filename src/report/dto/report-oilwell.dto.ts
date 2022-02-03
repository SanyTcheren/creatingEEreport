import { isDateString, IsDateString, IsString } from 'class-validator';

export class ReportOilwellDto {
	@IsString({ message: 'Не указан тип буровой установки' })
	well: string;

	@IsString({ message: 'Не указан номер буровой установки' })
	detail: string;

	@IsDateString({ message: 'Не указно время начала работ' })
	start: string;

	@IsDateString({ message: 'Не указно время оканчания работ' })
	end: string;
}
