import { IsEmail, IsString } from 'class-validator';
import { ValidateDto } from '../../types/validateDto';

export class UserLoginDto implements ValidateDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsString({ message: 'Не указан пароль' })
	password: string;

	unvalidate?: string;
}
