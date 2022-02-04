import { ReportModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { Report } from './report.entity';
import { IReportRepository } from './report.repository.interface';

@injectable()
export class ReportRepository implements IReportRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, type, number, field, bush }: Report): Promise<ReportModel> {
		return this.prismaService.client.reportModel.create({
			data: {
				email,
				type,
				number,
				field,
				bush,
			},
		});
	}

	async find(email: string): Promise<ReportModel | null> {
		return this.prismaService.client.reportModel.findFirst({
			where: {
				email,
			},
		});
	}
}
