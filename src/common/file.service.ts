import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IFileService } from './file.service.interface';
import path from 'path';
import { mkdir, stat } from 'fs/promises';
import { UploadedFile } from 'express-fileupload';

@injectable()
export class FileService implements IFileService {
	private readonly _root;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this._root = path.join(__dirname, `../../public/files/`);
	}
	async getReport(email: string): Promise<string> {
		const reportPath = path.join(await this.getOutDir(email), 'report.xlsx');
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

	async getOutDir(email: string): Promise<string> {
		const dirPath = path.join(this._root, email.split('@')[0]);
		try {
			await stat(dirPath);
		} catch (error) {
			this.logger.log('[file service] создана директория для хранения файлов');
			await mkdir(dirPath);
		}
		return dirPath;
	}
}
