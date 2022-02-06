import { OilWellModel, ReportModel } from '@prisma/client';
import { UploadedFile } from 'express-fileupload';
import { ReportBuild } from '../types/custom';
import { ReportAddWellDto } from './dto/report-addwell.dto';
import { ReportGeneralDto } from './dto/report-general.dto';

export interface IReportService {
	createReport: (dto: ReportGeneralDto) => Promise<ReportModel>;
	addOilWell: (dto: ReportAddWellDto) => Promise<OilWellModel | null>;
	setDataFile: (dataFile: UploadedFile, email: string) => Promise<ReportModel | null>;
	getReport: (email: string) => Promise<ReportBuild>;
	clearOilWell: (email: string) => Promise<void>;
}
