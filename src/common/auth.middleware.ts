import { Request, Response, NextFunction } from 'express';
import { IMiddleWare } from './middleware.interface';
import { verify } from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class AuthMiddleWare implements IMiddleWare {
	private secret: string;
	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IConfigService) private configeService: IConfigService,
	) {
		this.secret = configeService.get('SECRET');
	}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.body.jwt) {
			verify(req.body.jwt, this.secret, (err: any) => {
				if (!err) {
					next();
				} else {
					this.logger.warn('[AuthMiddleWare] неверный токен авторизации');
					res.render('pages/login', {
						message: 'Авторизуйтесь!!!',
					});
				}
			});
		} else {
			this.logger.warn('[AuthMiddleWare] отсутствует токен авторизации');
			res.render('pages/login', {
				message: 'Авторизуйтесь!!!',
			});
		}
	}
}
