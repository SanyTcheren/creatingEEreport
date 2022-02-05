import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { IReportController } from './report.controller.interface';
import { ReportGeneralDto } from './dto/report-general.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { ReportAddWellDto } from './dto/report-addwell.dto';
import { AuthMiddleWare } from '../common/auth.middleware';
import { IConfigService } from '../config/config.service.interface';
import { IReportService } from './report.service.interface';
import { ReportOilWellDto } from './dto/report-oilwell.dto';
import { ReportInputDto } from './dto/report-input.dto';
import { IFileService } from '../common/file.service.interface';
import { ReportSaveDto } from './dto/report-save.dto';

@injectable()
export class ReportController extends BaseController implements IReportController {
	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.IConfigService) private configeService: IConfigService,
		@inject(TYPES.AuthMiddleWare) private authMiddleWare: AuthMiddleWare,
		@inject(TYPES.IReportService) private reportService: IReportService,
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
				middlewares: [new ValidateMiddleware(ReportAddWellDto), authMiddleWare],
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
	async general(
		{ body }: Request<{}, {}, ReportGeneralDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (body.unvalidate) {
			this.unvalidateRender(body, res, 'pages/general');
		} else {
			await this.reportService.createReport(body);
			this.logger.log('[report controller] go to the oil well page');
			res.render('pages/oilwell', {
				message: 'введите данные по скважинам',
				jwt: body.jwt,
				email: body.email,
			});
		}
	}
	oilwell({ body }: Request<{}, {}, ReportOilWellDto>, res: Response, next: NextFunction): void {
		this.logger.log('[report controller] go to the input page');
		res.render('pages/input', {
			message: 'выберите и загрузите файл с профилем мощности',
			jwt: body.jwt,
			email: body.email,
		});
	}
	async addwell(
		{ body }: Request<{}, {}, ReportAddWellDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (body.unvalidate) {
			this.unvalidateRender(body, res, 'pages/oilwell');
		} else {
			await this.reportService.addOilWell(body);
			this.logger.log('[report controller] add well');
			res.render('pages/oilwell', {
				message: `скважина ${body.well} ${body.detail == 'drill' ? 'бурение' : 'пзр'} начало: ${
					body.start
				} окончание: ${body.end}`,
				jwt: body.jwt,
				email: body.email,
			});
		}
	}
	async input(
		req: Request<{}, {}, ReportInputDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (!req.files || Object.keys(req.files).length === 0) {
			this.logger.warn('[report controller] input don`t selected data-file');
			res.render('pages/input', {
				message: '!! не выбран файл с данными !!',
				jwt: req.body.jwt,
				email: req.body.email,
			});
		} else {
			const dataFile = req.files.dataFile as UploadedFile;
			await this.reportService.setDataFile(dataFile, req.body.email);
			res.render('pages/report', {
				message: 'сохраните отчет',
				jwt: req.body.jwt,
				email: req.body.email,
			});
		}
	}

	async save(
		{ body }: Request<{}, {}, ReportSaveDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const reportFile = await this.reportService.getReport(body.email);
		res.download(reportFile);
		this.logger.log('[report controller] save report');
	}
}
