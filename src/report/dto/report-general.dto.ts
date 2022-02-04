import { IsEmail, IsString } from 'class-validator';
import { ValidateDto } from '../../types/validateDto';

export class ReportGeneralDto implements ValidateDto {
	@IsString({ message: 'Не указан тип буровой установки' })
	type: string;

	@IsString({ message: 'Не указан номер буровой установки' })
	number: string;

	@IsString({ message: 'Не указно месторождение' })
	field: string;

	@IsString({ message: 'Не указан куст' })
	bush: string;

	@IsEmail({ message: 'Отсутствуют даннные о пользователе' })
	email: string;

	jwt?: string;

	unvalidate?: string;
}
