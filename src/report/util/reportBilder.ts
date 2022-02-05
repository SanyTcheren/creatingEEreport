import { inject, injectable } from 'inversify';
import { IFileService } from '../../common/file.service.interface';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import { Report } from '../report.entity';
import Excel from 'exceljs';
import { OilWell } from '../oilwell';
import moment, { Moment } from 'moment';
import { getPower } from './readPowerProfile';

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

	keys = {
		maxWells: 4,
		maxRow: 21,
		firstRow: 10,
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

	async build(report: Report): Promise<string> {
		this.report = report;
		const resultPath = await this.fileService.getReport(report.email);
		const powerPath = report.dataFile;

		try {
			//Создаем лист отчета
			const workbook = new Excel.Workbook();
			await workbook.xlsx.readFile(this.templatePath);
			const sheet = workbook.getWorksheet(1);

			//получаем данные для отчета
			const wells = await this.getSortedWells();
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
		return resultPath;
	}

	async getSortedWells(): Promise<OilWell[]> {
		const wells = this.report.wells;
		if (wells.length == 0) return [];

		const sortedWells = Object.values(wells).sort((a, b) => {
			const aStart = moment(a.start);
			const bStart = moment(b.start);
			return aStart.isAfter(bStart) ? 1 : -1;
		});
		return sortedWells;
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

	setSheet = async (sheet: Excel.Worksheet, wells: OilWell[], power: number[][]): Promise<void> => {
		// Устанавливаем общие данные
		// const data = await readData();
		sheet.getCell(this.CELLS.month).value = this.MONTH[this.month - 1];
		sheet.getCell(this.CELLS.year).value = `Месяц ${this.year} года`;
		sheet.getCell(this.CELLS.typeNumber).value = `${this.report.type}, зав №${this.report.number}`;
		sheet.getCell(this.CELLS.field).value = this.report.field;
		sheet.getCell(this.CELLS.bush).value = this.report.bush;

		//Срезаем лишние строки из таблицы
		// const sliceCount = (keys.maxWells - wells.length) * 3;
		// const endRow = keys.maxRow - sliceCount + 1;
		// sheet.spliceRows(endRow, sliceCount);

		//Восстанавливем свойства объединенных ячеек
		// sheet.unMergeCells(`B${28 - sliceCount}:D${28 - sliceCount}`);
		// sheet.mergeCells(`B${28 - sliceCount}:D${28 - sliceCount}`);
		// sheet.unMergeCells(`B${31 - sliceCount}:D${31 - sliceCount}`);
		// sheet.mergeCells(`B${31 - sliceCount}:D${31 - sliceCount}`);
		// sheet.unMergeCells(`B${34 - sliceCount}:D${34 - sliceCount}`);
		// sheet.mergeCells(`B${34 - sliceCount}:D${34 - sliceCount}`);
		// sheet.unMergeCells(`B${37 - sliceCount}:D${37 - sliceCount}`);
		// sheet.mergeCells(`B${37 - sliceCount}:D${37 - sliceCount}`);
		// sheet.unMergeCells(`B${38 - sliceCount}:D${38 - sliceCount}`);
		// sheet.mergeCells(`B${38 - sliceCount}:D${38 - sliceCount}`);
		// sheet.unMergeCells(`B${40 - sliceCount}:D${40 - sliceCount}`);
		// sheet.mergeCells(`B${40 - sliceCount}:D${40 - sliceCount}`);
		// sheet.unMergeCells(`L${32 - sliceCount}:P${32 - sliceCount}`);
		// sheet.mergeCells(`L${32 - sliceCount}:P${32 - sliceCount}`);
		// sheet.unMergeCells(`L${35 - sliceCount}:P${35 - sliceCount}`);
		// sheet.mergeCells(`L${35 - sliceCount}:P${35 - sliceCount}`);
		// sheet.unMergeCells(`AH${22 - sliceCount}:AI${22 - sliceCount}`);
		// sheet.mergeCells(`AH${22 - sliceCount}:AI${22 - sliceCount}`);

		// const month = await getKeyValue(PARAMS.month);
		// const year = await getKeyValue(PARAMS.year);

		//Индекс последней строки
		// const lastRow = this.keys.firstRow + wells.length * 3;
		//Заполняем данные по скважинам
		// for (let i = 0; i < wells.length; i++) {
		// 	const number = (wells[i][wells[i].prepare ? 'prepare' : 'build'].number);
		// 	sheet.getCell(`A${10 + 3 * i}`).value = number;
		// 	//заполняем пзр и бурение одинаково, 0- пзр, 1 - бурение
		// 	for (let k = 0; k < keys.stage.length; k++) {
		// 		if (wells[i][keys.stage[k]]) {
		// 			//начало работ
		// 			let start = wells[i][keys.stage[k]].start
		// 			sheet.getCell(`C${keys.firstRow + k + 3 * i}`).value = start;
		// 			start = moment(start);
		// 			//окончание работ
		// 			let end = wells[i][keys.stage[k]].end;
		// 			sheet.getCell(`D${keys.firstRow + k + 3 * i}`).value = /^3000.*/.test(end) ? 'переход' : end;
		// 			end = moment(end);
		// 			//потребленная мощность
		// 			const hours = getHoursOfWork(start, end, month, year);
		// 			for (let d = 0; d < hours.length; d++) { //d - будет соответствовать (дню месяца - 1)
		// 				if (hours[d][0] == -1) continue;
		// 				//отрезаем нужный массив энергии и суммируем
		// 				let pow = power[d].slice(hours[d][0], hours[d][1] + 1).reduce((s, p) => s + p);
		// 				sheet.getCell(`${keys.day[d]}${keys.firstRow + k + 3 * i}`).value = Math.round(pow);
		// 			}
		// 		}
		// 	}
		//Запись математичиских формул
		// for (let m = 0; m < keys.day.length; m++) {
		// 	sheet.getCell(`${keys.day[m]}${keys.firstRow + 2 + 3 * i}`).value = {
		// 		formula: `${keys.day[m]}${keys.firstRow + 3 * i}+${keys.day[m]}${keys.firstRow + 1 + 3 * i}`
		// 	}
		// }
		// sheet.getCell(`AJ${keys.firstRow + i * 3}`).value = {
		// 	formula: `SUM(E${keys.firstRow + i * 3}:AI${keys.firstRow + i * 3})`,
		// }
		// sheet.getCell(`AJ${keys.firstRow + 1 + i * 3}`).value = {
		// 	formula: `SUM(E${keys.firstRow + 1 + i * 3}:AI${keys.firstRow + 1 + i * 3})`,
		// }
		// sheet.getCell(`AJ${keys.firstRow + 2 + i * 3}`).value = {
		// 	formula: `AJ${keys.firstRow + i * 3}+AJ${keys.firstRow + 1 + i * 3}`,
		// }

		// sheet.getCell(`AK${keys.firstRow + i * 3}`).value = {
		// 	formula: `AJ${keys.firstRow + i * 3}/AJ${lastRow}*AL${lastRow}`,
		// }
		// sheet.getCell(`AK${keys.firstRow + 1 + i * 3}`).value = {
		// 	formula: `AJ${keys.firstRow + 1 + i * 3}/AJ${lastRow}*AL${lastRow}`,
		// }
		// sheet.getCell(`AK${keys.firstRow + 2 + i * 3}`).value = {
		// 	formula: `AK${keys.firstRow + i * 3}+AK${keys.firstRow + 1 + i * 3}`,
		// }
		// }
	};
}
