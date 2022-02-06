import { OilWellModel, ReportModel } from '@prisma/client';
import { OilWell } from './oilwell';
import { Report } from './report.entity';

export interface IReportRepository {
	create: (report: Report) => Promise<ReportModel>;
	find: (email: string) => Promise<ReportModel | null>;
	addWell: (well: OilWell, email: string) => Promise<OilWellModel | null>;
	setFile: (dataFile: string, email: string) => Promise<ReportModel | null>;
	getReport: (email: string) => Promise<ReportModel>;
	getOilWell: (email: string) => Promise<OilWellModel[]>;
	clearOilWell: (email: string) => Promise<void>;
}
