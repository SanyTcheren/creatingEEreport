import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { IReportController } from './report.controller.interface';

@injectable()
export class ReportController extends BaseController implements IReportController {
	constructor(@inject(TYPES.ILogger) logger: ILogger) {
		super(logger);
		this.bindRotes([
			{
				path: '/general',
				method: 'get',
				func: this.general,
				middlewares: [],
			},
			{
				path: '/general',
				method: 'post',
				func: this.general,
				middlewares: [],
			},
			{
				path: '/input',
				method: 'get',
				func: this.input,
				middlewares: [],
			},
			{
				path: '/input',
				method: 'post',
				func: this.input,
				middlewares: [],
			},
			{
				path: '/oilwell',
				method: 'get',
				func: this.oilwell,
				middlewares: [],
			},
			{
				path: '/oilwell',
				method: 'post',
				func: this.oilwell,
				middlewares: [],
			},
			{
				path: '/report',
				method: 'get',
				func: this.report,
				middlewares: [],
			},
			{
				path: '/report',
				method: 'post',
				func: this.report,
				middlewares: [],
			},
			{
				path: '/save',
				method: 'post',
				func: this.save,
				middlewares: [],
			},
		]);
	}
	general(req: Request, res: Response, next: NextFunction): void {
		res.render('pages/general', { message: 'you register success!!!' });
	}
	oilwell(req: Request, res: Response, next: NextFunction): void {
		res.render('pages/oilwell', { message: 'you register success!!!' });
	}
	async input(
		// { body }: Request<{}, {}, UserLoginDto>,
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		// console.log(body.email);
		res.render('pages/input', { message: 'you register success!!!' });
	}
	report(req: Request, res: Response, next: NextFunction): void {
		if (!req.files || Object.keys(req.files).length === 0) {
			res.status(400).send('No files were uploaded.');
		} else {
			// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
			const sampleFile = req.files.sampleFile as UploadedFile;
			const uploadPath = path.join(__dirname, '../../public/files', sampleFile.name);

			// Use the mv() method to place the file somewhere on your server
			sampleFile.mv(uploadPath, function (err) {
				if (err) return res.status(500).send(err);

				// res.send('File uploaded!');
				res.render('pages/report', { message: 'you register success!!!' });
			});
		}
	}

	save(req: Request, res: Response, next: NextFunction): void {
		const file = path.join(__dirname, '../../public/files/report.xlsx');
		res.download(file);
	}
}
