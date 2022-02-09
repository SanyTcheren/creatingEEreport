import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import path from 'path';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExceptionFilter } from './error/exception.fiter.interface';
import { IConfigService } from './config/config.service.interface';
import { IUserController } from './user/user.controller.interface';
import { urlencoded } from 'body-parser';
import fileUpload from 'express-fileupload';
import { IReportController } from './report/report.controller.interface';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
	app: Express;
	server: Server | undefined;
	port: string;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUserController) private userController: IUserController,
		@inject(TYPES.IReportController) private reportController: IReportController,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = process.env.PORT || '8000';
	}

	useMiddleware(): void {
		this.app.use(urlencoded({ extended: false }));
		this.app.use(fileUpload());
	}

	useStartPage(): void {
		this.app.use(/^\/$/, (req: Request, res: Response) => {
			this.logger.log(`[application] load first page`);
			res.render('pages/start');
		});
	}

	useRotes(): void {
		this.app.use('/user', this.userController.router);
		this.app.use('/report', this.reportController.router);
	}

	useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.app.use(express.static(path.join(__dirname, '../public')));
		this.app.set('view engine', 'ejs');
		this.useMiddleware();
		this.useStartPage();
		this.useRotes();
		this.useExceptionFilter();
		await this.prismaService.connect();
		this.server = this.app.listen(Number(this.port));
		this.logger.log(`[application] Сервер запущен на http://localhost:${this.port}`);
	}

	public async close(): Promise<void> {
		await this.prismaService.disconnect();
		this.server?.close();
	}
}
