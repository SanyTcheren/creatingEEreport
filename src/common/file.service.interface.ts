import { UploadedFile } from 'express-fileupload';

export interface IFileService {
	getOutDir: (email: string) => Promise<string>;
	uploadFile: (file: UploadedFile, email: string) => Promise<string>;
	getReport: (email: string) => Promise<string>;
	getTemplate: () => string;
}
