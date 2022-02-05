import { Report } from '../report.entity';

export class ReportBuilder {
	constructor(private report: Report) {}
	build(): string {
		return 'pathReport';
	}
}
