import { ReportModel } from '@prisma/client';
import { Report } from './report.entity';

export interface IReportRepository {
	create: (report: Report) => Promise<ReportModel>;
	find: (email: string) => Promise<ReportModel | null>;
}
