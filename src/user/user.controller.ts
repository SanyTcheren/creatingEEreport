import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { BaseController } from '../common/base.controller';
import { IUserController } from './user.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { ExpressReturnType } from '../common/route.interface';

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
				path: '/register',
				method: 'get',
				func: this.register,
				middlewares: [],
			},
			{
				path: '/input',
				method: 'post',
				func: this.input,
				middlewares: [],
			},
			{
				path: '/report',
				method: 'post',
				func: this.report,
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
	input(req: Request, res: Response, next: NextFunction): void {
		// console.log(req);
		res.render('pages/input');
	}
	report(req: Request, res: Response, next: NextFunction): void {
		res.render('pages/report');
	}
}
