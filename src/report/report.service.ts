import { ReportModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ReportGeneralDto } from './dto/report-general.dto';
import { Report } from './report.entity';
import { IReportRepository } from './report.repository.interface';
import { IReportService } from './report.service.interface';

@injectable()
export class ReportService implements IReportService {
	constructor(@inject(TYPES.IReportRepository) private userRepository: IReportRepository) {}

	async createReport(dto: ReportGeneralDto): Promise<ReportModel> {
		const newReport = new Report(dto.email, dto.type, dto.number, dto.field, dto.bush);
		return this.userRepository.create(newReport);
	}
}
