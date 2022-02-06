import { inject, injectable } from 'inversify';
import { IFileService } from '../../common/file.service.interface';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { Report } from '../report.entity';
import Excel from 'exceljs';
import { OilWell } from '../oilwell';
import moment, { Moment } from 'moment';
import { getPower } from './readPowerProfile';
import { ReportBuild, WellPrepareDrill } from '../../types/custom';

@injectable()
export class ReportBuilder {
	MONTH = [
		'январь',
		'февраль',
		'март',
		'апрель',
		'май',
		'июнь',
		'июль',
		'август',
		'сентябрь',
		'октябрь',
		'ноябрь',
		'декабрь',
	];

	ROWS = {
		maxWells: 4,
		maxRow: 21,
		firstRow: 10,
		lastRow: 22,
		stage: ['prepare', 'build'],
		day: 'E F G H I J K L M N O P Q R S T U V W X Y Z AA AB AC AD AE AF AG AH AI'.split(' '),
	};

	CELLS = {
		month: 'D2',
		typeNumber: 'D4',
		year: 'E2',
		field: 'D5',
		bush: 'D6',
	};
	private templatePath: string;
	private report: Report;
	private month: number;
	private year: number;
	private days: number;
	// const days = 32 - new Date(year, month - 1, 32).getDate();

	constructor(
		@inject(TYPES.IFileService) private fileService: IFileService,
		@inject(TYPES.ILogger) private logger: ILogger,
	) {
		this.templatePath = fileService.getTemplate();
	}

	async build(report: Report): Promise<ReportBuild> {
		this.report = report;
		const resultPath = await this.fileService.getReport(report.email);
		const powerPath = report.dataFile;

		try {
			//Создаем лист отчета
			const workbook = new Excel.Workbook();
			await workbook.xlsx.readFile(this.templatePath);
			const sheet = workbook.getWorksheet(1);

			//получаем данные для отчета
			const wells = await this.getWellPrepareDrill();
			const { power, year, month } = await getPower(powerPath);
			this.year = year;
			this.month = month;
			this.days = 32 - new Date(year, month - 1, 32).getDate();

			//записываем данные в отчет
			await this.setSheet(sheet, wells, power);

			//Сохраняем файл
			await workbook.xlsx.writeFile(resultPath);
			this.logger.log('[report builder] Отчет создан.');
		} catch (error) {
			this.logger.error('[report builder] `Не удалось создать отчет.');
		}
		return { resultPath, errorMessage: 'Ok' };
	}

	async getWellPrepareDrill(): Promise<WellPrepareDrill[]> {
		const wells = this.report.wells;
		if (wells.length == 0) return [];

		const sortedWells: any[] = Object.values(wells).sort((a, b) => {
			const aStart = moment(a.start);
			const bStart = moment(b.start);
			return aStart.isAfter(bStart) ? 1 : -1;
		});
		//Нормализуем данные по скважинам так, что первый элемент массива - prepare, а последний - drill
		if (sortedWells[0].detail == 'drill') {
			sortedWells.unshift(null);
		}
		if (sortedWells[sortedWells.length - 1].detail == 'prepare') {
			sortedWells.push(null);
		}
		//Сгруппируем данные по скважинам
		const result: WellPrepareDrill[] = [];
		for (let i = 0; i < sortedWells.length; i += 2) {
			result.push({ prepare: sortedWells[i], drill: sortedWells[i + 1] });
		}
		return result;
	}

	//Возвращаем двумерный массив 31*2, соответствующий часам работы на каждый день, -1 - нерабочий день 23 - полный рабочий день
	getHoursOfWork(start: Moment, end: Moment): number[][] {
		//Создание массива
		const hours = [];
		for (let i = 0; i < 31; i++) {
			hours.push([-1, 23]);
		}
		//Проверка что работы начались в отчетном месяце и задание старта работ в первый день
		let dayStart = start.date();
		if (start.isBefore(`${this.year}-${this.month < 10 ? '0' + this.month : this.month}-01`)) {
			dayStart = 1;
			hours[0][0] = 0;
		} else {
			hours[dayStart - 1][0] = start.hour();
		}
		//Проверка что работы закончились в текущем месяце и задание окончания работ последнего дня
		let dayEnd = end.date();
		if (
			end.isAfter(`${this.year}-${this.month < 10 ? '0' + this.month : this.month}-${this.days}`)
		) {
			dayEnd = this.days;
		} else {
			hours[dayEnd - 1][1] = end.hour() - 1; //отнимаем час так как работы уже закончились!!!!!!!!
		}
		//Задание начала работ для промежуточных и последнего дня
		for (let i = dayStart; i < dayEnd; i++) {
			if (hours[i][1] != -1) {
				//Проверка что работы не закончились в полночь!!!!!
				hours[i][0] = 0;
			}
		}
		return hours;
	}

	setSheet = async (
		sheet: Excel.Worksheet,
		wells: WellPrepareDrill[],
		power: number[][],
	): Promise<void> => {
		// Устанавливаем общие данные
		sheet.getCell(this.CELLS.month).value = this.MONTH[this.month - 1];
		sheet.getCell(this.CELLS.year).value = `Месяц ${this.year} года`;
		sheet.getCell(this.CELLS.typeNumber).value = `${this.report.type}, зав №${this.report.number}`;
		sheet.getCell(this.CELLS.field).value = this.report.field;
		sheet.getCell(this.CELLS.bush).value = this.report.bush;

		//Заполняем данные по скважинам
		for (let i = 0; i < wells.length; i++) {
			//заполняем пзр и бурение одинаково, 0- пзр, 1 - бурение
			const keys = {
				prepare: 0,
				drill: 1,
			};
			let detail: 'prepare' | 'drill';
			for (detail in keys) {
				if (wells[i][detail]) {
					//Номер скважины
					sheet.getCell(`A${10 + 3 * i}`).value = wells[i][detail]?.well;
					//начало работ
					const start: Moment = moment(wells[i][detail]?.start);
					sheet.getCell(`C${this.ROWS.firstRow + keys[detail] + 3 * i}`).value =
						start.format('DD.MM.YYYY HH:mm');
					//окончание работ
					const end: Moment = moment(wells[i][detail]?.end);
					sheet.getCell(`D${this.ROWS.firstRow + keys[detail] + 3 * i}`).value =
						end.format('DD.MM.YYYY HH:mm');
					//потребленная мощность
					const hours = this.getHoursOfWork(start, end);
					for (let d = 0; d < hours.length; d++) {
						//d - будет соответствовать (дню месяца - 1)
						if (hours[d][0] == -1) continue; // Пропускаем нерабочие дни
						//отрезаем нужный массив энергии и суммируем
						const pow = power[d].slice(hours[d][0], hours[d][1] + 1).reduce((s, p) => s + p);
						sheet.getCell(`${this.ROWS.day[d]}${this.ROWS.firstRow + keys[detail] + 3 * i}`).value =
							// Math.round(pow);
							pow;
					}
				}
			}
		}
		//Запись математичиских формул
		sheet.getCell(`AJ22`).value = {
			formula: `AJ12+AJ15+AJ18+AJ21`,
		} as Excel.Cell;
		for (let i = 0; i < this.ROWS.maxWells; i++) {
			for (let m = 0; m < this.ROWS.day.length; m++) {
				sheet.getCell(`${this.ROWS.day[m]}${this.ROWS.firstRow + 2 + 3 * i}`).value = {
					formula: `${this.ROWS.day[m]}${this.ROWS.firstRow + 3 * i}+${this.ROWS.day[m]}${
						this.ROWS.firstRow + 1 + 3 * i
					}`,
				} as Excel.Cell;
			}
			sheet.getCell(`AJ${this.ROWS.firstRow + i * 3}`).value = {
				formula: `SUM(E${this.ROWS.firstRow + i * 3}:AI${this.ROWS.firstRow + i * 3})`,
			} as Excel.Cell;
			sheet.getCell(`AJ${this.ROWS.firstRow + 1 + i * 3}`).value = {
				formula: `SUM(E${this.ROWS.firstRow + 1 + i * 3}:AI${this.ROWS.firstRow + 1 + i * 3})`,
			} as Excel.Cell;
			sheet.getCell(`AJ${this.ROWS.firstRow + 2 + i * 3}`).value = {
				formula: `AJ${this.ROWS.firstRow + i * 3}+AJ${this.ROWS.firstRow + 1 + i * 3}`,
			} as Excel.Cell;

			sheet.getCell(`AK${this.ROWS.firstRow + i * 3}`).value = {
				formula: `AJ${this.ROWS.firstRow + i * 3}/AJ${this.ROWS.lastRow}*AL${this.ROWS.lastRow}`,
			} as Excel.Cell;
			sheet.getCell(`AK${this.ROWS.firstRow + 1 + i * 3}`).value = {
				formula: `AJ${this.ROWS.firstRow + 1 + i * 3}/AJ${this.ROWS.lastRow}*AL${
					this.ROWS.lastRow
				}`,
			} as Excel.Cell;
			sheet.getCell(`AK${this.ROWS.firstRow + 2 + i * 3}`).value = {
				formula: `AK${this.ROWS.firstRow + i * 3}+AK${this.ROWS.firstRow + 1 + i * 3}`,
			} as Excel.Cell;
		}
	};
}
