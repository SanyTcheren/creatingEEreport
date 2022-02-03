import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { IUserController } from './user.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import path from 'path';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) logger: ILogger) {
		super(logger);
		this.bindRotes([
			{
				path: '/',
				method: 'get',
				func: this.start,
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
		]);
	}
	start(req: Request, res: Response, next: NextFunction): void {
		res.render('pages/start');
		// this.ok(res, 'sany');
	}
	login(req: Request, res: Response, next: NextFunction): void {
		res.render('pages/login', { message: 'you register success!!!' });
		// this.ok(res, 'sany');
	}
	register(req: Request, res: Response, next: NextFunction): void {
		res.render('pages/register', { message: 'you register success!!!' });
	}
	info(req: Request, res: Response, next: NextFunction): void {
		return;
	}
}
