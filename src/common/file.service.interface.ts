import { UploadedFile } from 'express-fileupload';
import { CheckDataFile } from '../types/custom';

export interface IFileService {
	getOutDir: (email: string) => Promise<string>;
	uploadFile: (file: UploadedFile, email: string) => Promise<string>;
	getReport: (email: string) => Promise<string>;
	getTemplate: () => string;
	checkFile: (pathFile: string) => Promise<CheckDataFile>;
}
