import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { IUserController } from './user.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import path from 'path';
import { ValidateMiddleware } from '../common/validate.middleware';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) logger: ILogger) {
		super(logger);
		this.bindRotes([
			{
				path: '/start',
				method: 'get',
				func: this.start,
				middlewares: [],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
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
				func: this.registration,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}
	start(req: Request, res: Response, next: NextFunction): void {
		this.logger.log('[user controller] load login page');
		res.render('pages/login', { message: 'авторизуйтесь либо зарегистрируйтесь' });
	}
	login(req: Request, res: Response, next: NextFunction): void {
		if (req.body.unvalidate) {
			this.unvalidateRender(req, res, 'pages/login');
		} else {
			this.logger.log('[user controller] user login, go to the general page');
			res.render('pages/general', {
				message: 'введите общие данные по буровой установке и месторождению',
			});
		}
	}
	register(req: Request, res: Response, next: NextFunction): void {
		this.logger.log('[user controller] go to the register page');
		res.render('pages/register', {
			message: 'зарегистрируйтесь и перейдите к авторизации',
		});
	}
	registration(req: Request, res: Response, next: NextFunction): void {
		if (req.body.unvalidate) {
			this.unvalidateRender(req, res, 'pages/register');
		} else {
			this.logger.log('[user controller] go to the login page');
			res.render('pages/login', {
				message: 'вы зарегистрировались, теперь авторизуйтесь',
			});
		}
	}
	info(req: Request, res: Response, next: NextFunction): void {
		return;
	}
}
