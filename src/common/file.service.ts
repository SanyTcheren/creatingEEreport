import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IFileService } from './file.service.interface';
import path from 'path';
import { mkdir, stat, rm } from 'fs/promises';
import { UploadedFile } from 'express-fileupload';
import { CheckDataFile } from '../types/custom';
import { checkDataFile } from '../report/util/readPowerProfile';

@injectable()
export class FileService implements IFileService {
	private readonly _root;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this._root = path.join(__dirname, `../../public/files/`);
	}
	async removeDirFiles(pathDir: string): Promise<void> {
		const absPathDir = path.join(this._root, pathDir);
		try {
			await stat(absPathDir);
			await rm(absPathDir, { recursive: true });
		} catch (error) {
			console.log(error);
		}
	}

	async checkFile(pathFile: string): Promise<CheckDataFile> {
		try {
			return await checkDataFile(pathFile);
		} catch (error) {
			return { error: 'файл содержит неверные данные!' };
		}
	}

	async getReport(email: string): Promise<string> {
		const reportPath = path.join(await this.getOutDir(email), 'report.xlsx');
		return reportPath;
	}

	async getPathFile(file: string): Promise<string> {
		const reportPath = path.join(this._root, file);
		return reportPath;
	}

	async uploadFile(file: UploadedFile, email: string): Promise<string> {
		const filePath = path.join(await this.getOutDir(email), file.name);
		file.mv(filePath, (err) => {
			if (err) {
				this.logger.error('[file service] неудалось загрузить файл');
			}
		});
		return filePath;
	}

	async uploadAdminFile(file: UploadedFile, pathDir: string): Promise<string> {
		const filePath = path.join(this._root, pathDir, file.name);
		file.mv(filePath, (err) => {
			if (err) {
				this.logger.error('[file service] неудалось загрузить файл');
			}
		});
		return filePath;
	}

	async getOutDir(email: string): Promise<string> {
		const dirPath = path.join(this._root, email.split('@')[0]);
		try {
			await stat(dirPath);
		} catch (error) {
			this.logger.log('[file service] создана директория для хранения файлов');
			await mkdir(dirPath, { recursive: true });
		}
		return dirPath;
	}

	getTemplate(): string {
		return path.join(this._root, '../template/template.xlsx');
	}
}
