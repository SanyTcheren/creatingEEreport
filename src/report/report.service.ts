import { OilWellModel, ReportModel } from '@prisma/client';
import { UploadedFile } from 'express-fileupload';
import { inject, injectable } from 'inversify';
import { IFileService } from '../common/file.service.interface';
import { TYPES } from '../types';
import { CheckDataFile, ReportBuild } from '../types/custom';
import { ReportAddWellDto } from './dto/report-addwell.dto';
import { ReportGeneralDto } from './dto/report-general.dto';
import { OilWell } from './oilwell';
import { Report } from './report.entity';
import { IReportRepository } from './report.repository.interface';
import { IReportService } from './report.service.interface';
import { ReportBuilder } from './util/reportBilder';

@injectable()
export class ReportService implements IReportService {
	constructor(
		@inject(TYPES.IReportRepository) private reportRepository: IReportRepository,
		@inject(TYPES.IFileService) private fileService: IFileService,
		@inject(TYPES.ReportBuilder) private reportBuilder: ReportBuilder,
	) {}

	async clearOilWell(email: string): Promise<void> {
		await this.reportRepository.clearOilWell(email);
	}

	async createReport(dto: ReportGeneralDto): Promise<ReportModel> {
		const newReport = new Report(dto.email, dto.type, dto.number, dto.field, dto.bush);
		return await this.reportRepository.create(newReport);
	}

	async addOilWell({
		well,
		detail,
		start,
		end,
		email,
	}: ReportAddWellDto): Promise<OilWellModel | null> {
		const newOilWell = new OilWell(well, detail, start, end);
		return await this.reportRepository.addWell(newOilWell, email);
	}

	async setDataFile(dataFile: UploadedFile, email: string): Promise<CheckDataFile> {
		const uploadPath = await this.fileService.uploadFile(dataFile, email);
		await this.reportRepository.setFile(uploadPath, email);
		const { month, power, error } = await this.fileService.checkFile(uploadPath);
		return { month, power, error };
	}

	async getReport(emailGet: string): Promise<ReportBuild> {
		const { email, type, number, field, bush, dataFile } = await this.reportRepository.getReport(
			emailGet,
		);
		const oilWells = await this.reportRepository.getOilWell(email);
		const report = new Report(email, type, number, field, bush);
		report.setDataFile(dataFile as string);
		report.addWells(oilWells);
		return await this.reportBuilder.build(report);
	}
}
