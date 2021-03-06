import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interace';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async clear(email: string): Promise<void> {
		await this.prismaService.client.oilWellModel.deleteMany({
			where: {
				report: {
					email,
				},
			},
		});
	}

	async create({ name, email, password }: User): Promise<UserModel | null> {
		if (await this.find(email)) {
			return null;
		}
		return await this.prismaService.client.userModel.create({
			data: {
				email,
				name,
				password,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return await this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
