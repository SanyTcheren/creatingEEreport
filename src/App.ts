import 'reflect-metadata';
import express, { Express } from 'express';
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
	) {
		this.app = express();
		this.port = configService.get('PORT');
	}

	useMiddleware(): void {
		this.app.use(urlencoded({ extended: false }));
		this.app.use(fileUpload());
	}

	useRotes(): void {
		this.app.use('/', this.userController.router);
	}

	useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.app.use(express.static(path.join(__dirname, '../public')));
		this.app.set('view engine', 'ejs');
		this.useMiddleware();
		this.useRotes();
		this.useExceptionFilter();
		this.server = this.app.listen(Number(this.port));
		this.logger.log(`[application] Сервер запущен на http://localhost:${this.port}`);
	}

	public close(): void {
		this.server?.close();
	}
}
