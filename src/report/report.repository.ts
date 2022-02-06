import { OilWellModel, ReportModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { OilWell } from './oilwell';
import { Report } from './report.entity';
import { IReportRepository } from './report.repository.interface';

@injectable()
export class ReportRepository implements IReportRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async clearOilWell(email: string): Promise<void> {
		await this.prismaService.client.oilWellModel.deleteMany({
			where: {
				report: {
					email,
				},
			},
		});
	}

	async create({ email, type, number, field, bush }: Report): Promise<ReportModel> {
		if (await this.find(email)) {
			this.clearOilWell(email);
			return await this.prismaService.client.reportModel.update({
				data: {
					email,
					type,
					number,
					field,
					bush,
				},
				where: {
					email,
				},
			});
		} else {
			return await this.prismaService.client.reportModel.create({
				data: {
					email,
					type,
					number,
					field,
					bush,
				},
			});
		}
	}

	async find(email: string): Promise<ReportModel | null> {
		return await this.prismaService.client.reportModel.findFirst({
			where: {
				email,
			},
		});
	}

	async addWell(
		{ well, detail, start, end }: OilWell,
		email: string,
	): Promise<OilWellModel | null> {
		return await this.prismaService.client.oilWellModel.create({
			data: {
				well,
				detail,
				start,
				end,
				report: {
					connect: { email },
				},
			},
		});
	}

	async setFile(dataFile: string, email: string): Promise<ReportModel | null> {
		return await this.prismaService.client.reportModel.update({
			data: {
				dataFile,
			},
			where: {
				email,
			},
		});
	}

	async getReport(email: string): Promise<ReportModel> {
		const report = await this.prismaService.client.reportModel.findFirst({
			where: {
				email,
			},
		});
		return report as ReportModel;
	}

	async getOilWell(email: string): Promise<OilWellModel[]> {
		return await this.prismaService.client.oilWellModel.findMany({
			where: {
				report: {
					email,
				},
			},
		});
	}
}
