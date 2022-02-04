import { OilWellModel, ReportModel } from '@prisma/client';
import { ReportAddWellDto } from './dto/report-addwell.dto';
import { ReportGeneralDto } from './dto/report-general.dto';

export interface IReportService {
	createReport: (dto: ReportGeneralDto) => Promise<ReportModel>;
	addOilWell: (dto: ReportAddWellDto) => Promise<OilWellModel | null>;
}
