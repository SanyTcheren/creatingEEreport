import { IsEmail, IsString } from 'class-validator';
import { ValidateDto } from '../../types/validateDto';

export class UserUploadDto implements ValidateDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	jwt?: string;

	unvalidate?: string;

	path: string;
}
