import { stat, readFile } from 'fs/promises';
import inconv from 'iconv-lite';

const kPower = 7200; //Коэффициент трансформации

const isExist = async (path: string): Promise<void> => {
	try {
		await stat(path);
	} catch (e) {
		throw new Error(`В рабочей папке отсутствует файл с профилем мощности - power.txt`);
	}
};

const readPower = async (file: string): Promise<Number[][]> => {
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
	return power;
};
//Возвращаем двумерный массив 31*24 значения - мощность за час
const getPower = async (file: string): Promise<Number[][]> => {
	await isExist(file);
	const power = await readPower(file);
	return power;
};

export { getPower };
