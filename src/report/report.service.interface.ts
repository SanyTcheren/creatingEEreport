import { ReportModel } from '@prisma/client';
import { ReportGeneralDto } from './dto/report-general.dto';

export interface IReportService {
	createReport: (dto: ReportGeneralDto) => Promise<ReportModel>;
}
