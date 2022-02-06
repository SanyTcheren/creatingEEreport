import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interace';
import { IUserService } from './user.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configeService: IConfigService,
		@inject(TYPES.IUserRepository) private userRepository: IUserRepository,
	) {}
	async clearUser(email: string): Promise<void> {
		return await this.userRepository.clear(email);
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		const extendUser = await this.userRepository.find(dto.email);
		if (!extendUser) {
			return false;
		} else {
			const newUser = new User(extendUser.name, extendUser.email, extendUser.password);
			return await newUser.comparePassword(dto.password);
		}
	}

	async createUser(dto: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(dto.name, dto.email);
		const salt = this.configeService.get('SALT');
		await newUser.setPassword(dto.password, salt);
		return await this.userRepository.create(newUser);
	}
}
