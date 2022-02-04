import { IsEmail, IsString } from 'class-validator';
import { ValidateDto } from '../../types/validateDto';

export class UserRegisterDto implements ValidateDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsString({ message: 'Не указан пароль' })
	password: string;

	@IsString({ message: 'Не указано имя' })
	name: string;

	unvalidate?: string;
}
