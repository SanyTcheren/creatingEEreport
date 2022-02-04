import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { IReportController } from './report.controller.interface';
import { ReportGeneralDto } from './dto/report-general.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { ReportOilwellDto } from './dto/report-oilwell.dto';
import { AuthMiddleWare } from '../common/auth.middleware';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class ReportController extends BaseController implements IReportController {
	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.IConfigService) private configeService: IConfigService,
		@inject(TYPES.AuthMiddleWare) private authMiddleWare: AuthMiddleWare,
	) {
		super(logger);
		this.bindRotes([
			{
				path: '/general',
				method: 'post',
				func: this.general,
				middlewares: [new ValidateMiddleware(ReportGeneralDto), authMiddleWare],
			},
			{
				path: '/oilwell',
				method: 'post',
				func: this.oilwell,
				middlewares: [authMiddleWare],
			},
			{
				path: '/addwell',
				method: 'post',
				func: this.addwell,
				middlewares: [new ValidateMiddleware(ReportOilwellDto), authMiddleWare],
			},
			{
				path: '/input',
				method: 'post',
				func: this.input,
				middlewares: [authMiddleWare],
			},
			{
				path: '/save',
				method: 'post',
				func: this.save,
				middlewares: [authMiddleWare],
			},
		]);
	}
	general(req: Request, res: Response, next: NextFunction): void {
		if (req.body.unvalidate) {
			this.unvalidateRender(req, res, 'pages/general');
		} else {
			this.logger.log('[report controller] go to the oil well page');
			res.render('pages/oilwell', {
				message: 'введите данные по буровой установке и месторождению',
				jwt: req.body.jwt,
			});
		}
	}
	oilwell(req: Request, res: Response, next: NextFunction): void {
		this.logger.log('[report controller] go to the input page');
		res.render('pages/input', {
			message: 'выберите и загрузите файл с профилем мощности',
			jwt: req.body.jwt,
		});
	}
	addwell(req: Request, res: Response, next: NextFunction): void {
		if (req.body.unvalidate) {
			this.unvalidateRender(req, res, 'pages/oilwell');
		} else {
			this.logger.log('[report controller] add well');
			res.render('pages/oilwell', {
				message: `скважина ${req.body.well} ${
					req.body.detail == 'drill' ? 'бурение' : 'пзр'
				} начало: ${req.body.start} окончание: ${req.body.end}`,
				jwt: req.body.jwt,
			});
		}
	}
	input(req: Request, res: Response, next: NextFunction): void {
		if (!req.files || Object.keys(req.files).length === 0) {
			this.logger.warn('[report controller] input don`t selected data-file');
			res.render('pages/input', { message: '!! не выбран файл с данными !!', jwt: req.body.jwt });
		} else {
			const dataFile = req.files.dataFile as UploadedFile;
			const uploadPath = path.join(__dirname, '../../public/files', dataFile.name);

			dataFile.mv(uploadPath, (err) => {
				if (err) {
					this.logger.warn('[report controller] input don`t upload data-file');
					res.render('pages/input', {
						message: '!! файл с данными не загрузился !!',
						jwt: req.body.jwt,
					});
				} else {
					res.render('pages/report', { message: 'сохраните отчет', jwt: req.body.jwt });
				}
			});
		}
	}

	save(req: Request, res: Response, next: NextFunction): void {
		const file = path.join(__dirname, '../../public/files/report.xlsx');
		res.download(file);
		this.logger.log('[report controller] save report');
	}
}
