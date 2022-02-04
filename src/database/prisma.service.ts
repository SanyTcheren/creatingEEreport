import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log(`[PrismaService] Успешно подключились к базе данных`);
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(`[PrismaService] Ошибка при подключении к БД: ${error.message}`);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
		this.logger.log(`[PrismaService] Успешно отключились от базы данных`);
	}
}
