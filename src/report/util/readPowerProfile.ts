import { stat, readFile } from 'fs/promises';
import inconv from 'iconv-lite';
import moment from 'moment';
import { CheckDataFile, PowerYearMonth } from '../../types/custom';

const kPower = 7200; //Коэффициент трансформации

const isExist = async (path: string): Promise<void> => {
	try {
		await stat(path);
	} catch (e) {
		throw new Error(`В рабочей папке отсутствует файл с профилем мощности - power.txt`);
	}
};

const readPower = async (file: string): Promise<PowerYearMonth> => {
	//Создаем массив
	const power = [];
	for (let i = 0; i < 31; i++) {
		power.push(new Array(24).fill(0));
	}
	const dataBuffer = await readFile(file);
	//Декодируем данные и разбиваем на массив по строкам
	const data = inconv.decode(dataBuffer, 'win1251');
	const dataArr = data.split('\n');
	//Первые 5 и 1 последняя строка не содержат информации о мощности
	for (let i = 0; i < (dataArr.length - 6) / 24; i++) {
		// i - соответствует дню
		for (let k = 0; k < 24; k++) {
			// k - соответствует часу
			//Каждую строку разбиваем на массив и выбираем активную энергию
			const p = dataArr[i * 24 + k + 5].split('\t')[2];
			//Пересчитвыаем с учетом формата записи и коэффициента мощности
			power[i][k] = +p.replace(',', '.') * kPower;
		}
	}
	const date: string[] = dataArr[dataArr.length - 2].split('\t')[0].split('.');
	return { power, year: +date[2], month: +date[1] };
};
//Возвращаем двумерный массив 31*24 значения - мощность за час
//Дополнительно возвращаем месяц и год
const getPower = async (file: string): Promise<PowerYearMonth> => {
	await isExist(file);
	const power = await readPower(file);
	return power;
};

export const checkDataFile = async (file: string): Promise<CheckDataFile> => {
	const dataBuffer = await readFile(file);
	const data = inconv.decode(dataBuffer, 'win1251');
	const dataArr = data.split('\n');
	//берем пятую строку файла, которая является первой строкой данных.
	const dataLine = dataArr[6].split('\t');
	const day = dataLine[0].split('.')[0];
	if (day != '01') {
		return { error: `Профиль мощности должен начинаться с первого числа месяца, а не с ${day}` };
	}
	const monthIndex = Number(dataLine[0].split('.')[1]) - 1;
	const monthString = [
		'январь',
		'февраль',
		'март',
		'апрель',
		'май',
		'июнь',
		'июль',
		'апрель',
		'сентябрь',
		'октябрь',
		'ноябрь',
		'декабрь',
	];
	let month = monthString[monthIndex];
	const lastDay = dataArr[dataArr.length - 2].split('.')[0];
	const days = moment().month(monthIndex).daysInMonth();
	if (Number.parseInt(lastDay, 10) < days) {
		month += `(только до ${lastDay} числа)`;
	}

	const time = dataLine[1].split('-');
	if (time[1].split(':')[1] != '00') {
		return {
			error:
				'В файле нет часового профиля мощности, возможно вы сохранили получасовой профиль мощности',
		};
	}
	let power = 0;
	for (let i = 5; i < dataArr.length - 1; i++) {
		power += Number(dataArr[i].split('\t')[2].replace(',', '.')) * kPower;
	}
	power = Math.round(power);
	return { power, month };
};

export { getPower };
