import 'reflect-metadata';
import express, { Request, Response, Express } from 'express';
import { Server } from 'http';
import path from 'path';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logger.interface';
import { IExceptionFilter } from './error/exception.fiter.interface';
import { HttpError } from './error/http.error';

@injectable()
export class App {
	app: Express;
	server: Server | undefined;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
	) {
		this.app = express();
	}

	useMiddleware(): void {
		return;
	}

	useRotes(): void {
		this.app.use(express.static(path.join(__dirname, '../public')));

		// устанавливаем движок EJS для представления
		this.app.set('view engine', 'ejs');

		this.app.get('/login', function (req, res) {
			res.render('pages/login');
		});

		this.app.get('/register', function (req, res, next) {
			next(new HttpError(403, 'тестовая ошибка', 'register'));
			// res.render('pages/register');
		});

		this.app.get('/input', function (req, res) {
			res.render('pages/input');
		});

		this.app.post('/report', function (req, res) {
			res.render('pages/report');
		});
	}

	useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRotes();
		this.useExceptionFilter();
		this.server = this.app.listen('8000');
		this.logger.log(`[application] Сервер запущен на http://localhost:8000/login`);
	}

	public close(): void {
		this.server?.close();
	}
}
