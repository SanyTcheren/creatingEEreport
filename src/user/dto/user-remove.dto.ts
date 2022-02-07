import { IsEmail, IsString } from 'class-validator';
import { ValidateDto } from '../../types/validateDto';

export class UserRemoveDto implements ValidateDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	jwt?: string;

	unvalidate?: string;

	pathDir: string;
}
