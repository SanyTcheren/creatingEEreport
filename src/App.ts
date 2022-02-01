import 'reflect-metadata';
import express, { Request, Response, Express } from 'express';
import { Server } from 'http';
import path from 'path';
import { injectable } from 'inversify';

@injectable()
export class App {
	app: Express;
	server: Server | undefined;

	constructor() {
		this.app = express();
	}

	rotes(): void {
		this.app.use(express.static(path.join(__dirname, '../public')));

		// устанавливаем движок EJS для представления
		this.app.set('view engine', 'ejs');

		this.app.get('/login', function (req, res) {
			res.render('pages/login');
		});

		this.app.get('/register', function (req, res) {
			res.render('pages/register');
		});

		this.app.get('/input', function (req, res) {
			res.render('pages/input');
		});

		this.app.post('/report', function (req, res) {
			res.render('pages/report');
		});
	}

	public async init(): Promise<void> {
		this.rotes();
		this.server = this.app.listen('8000');
		console.log(`Сервер запущен на http://localhost:8000/login`);
	}

	public close(): void {
		this.server?.close();
	}
}
