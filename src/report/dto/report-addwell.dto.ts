import { IsDateString, IsEmail, IsString } from 'class-validator';
import { Detail } from '../../types/custom';
import { ValidateDto } from '../../types/validateDto';

export class ReportAddWellDto implements ValidateDto {
	@IsString({ message: 'Не указан тип буровой установки' })
	well: string;

	@IsString({ message: 'Не указан номер буровой установки' })
	detail: Detail;

	@IsDateString({ message: 'Не указно время начала работ' })
	start: string;

	@IsDateString({ message: 'Не указно время оканчания работ' })
	end: string;

	@IsEmail({ message: 'Отсутствуют даннные о пользователе' })
	email: string;

	jwt?: string;

	unvalidate?: string;
}
