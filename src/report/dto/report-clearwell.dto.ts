import { ValidateDto } from '../../types/validateDto';
import { IsEmail } from 'class-validator';

export class ReportClearWellDto implements ValidateDto {
	@IsEmail({ message: 'Отсутствуют даннные о пользователе' })
	email: string;

	jwt?: string;

	unvalidate?: string;
}
