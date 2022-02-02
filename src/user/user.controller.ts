import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { IUserController } from './user.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UploadedFile } from 'express-fileupload';
import path from 'path';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) logger: ILogger) {
		super(logger);
		this.bindRotes([
			{
				path: '/',
				method: 'get',
				func: this.login,
				middlewares: [],
			},
			{
				path: '/login',
				method: 'get',
				func: this.login,
				middlewares: [],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [],
			},
			{
				path: '/register',
				method: 'get',
				func: this.register,
				middlewares: [],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [],
			},
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
	login(req: Request, res: Response, next: NextFunction): void {
		res.render('pages/login');
		// this.ok(res, 'sany');
	}
	register(req: Request, res: Response, next: NextFunction): void {
		res.render('pages/register');
	}
	info(req: Request, res: Response, next: NextFunction): void {
		return;
	}
	general(req: Request, res: Response, next: NextFunction): void {
		res.render('pages/general');
	}
	async input(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		console.log(body.email);
		res.render('pages/input');
	}
	oilwell(req: Request, res: Response, next: NextFunction): void {
		res.render('pages/oilwell');
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
				res.render('pages/report');
			});
		}
	}

	save(req: Request, res: Response, next: NextFunction): void {
		const file = path.join(__dirname, '../../public/files/report.xlsx');
		res.download(file);
	}
}
