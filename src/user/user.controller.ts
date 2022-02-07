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
import { UserService } from './user.service';
import { IUserService } from './user.service.interface';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';
import { IConfigService } from '../config/config.service.interface';
import { UserDownloadDto } from './dto/user-down.dto';
import { IFileService } from '../common/file.service.interface';
import { UserUploadDto } from './dto/user-upload.dto';
import { UploadedFile } from 'express-fileupload';
import { UserRemoveDto } from './dto/user-remove.dto';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) logger: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.IConfigService) private configeService: IConfigService,
		@inject(TYPES.IFileService) private fileService: IFileService,
	) {
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
			{
				path: '/download',
				method: 'post',
				func: this.download,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/upload',
				method: 'post',
				func: this.upload,
				middlewares: [],
			},
			{
				path: '/remove',
				method: 'post',
				func: this.remove,
				middlewares: [],
			},
		]);
	}

	async remove(
		{ body }: Request<{}, {}, UserRemoveDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			await this.fileService.removeDirFiles(body.pathDir);
			this.logger.log(`[user controller] remove ${body.pathDir}`);
			res.render('pages/admin', {
				message: 'root/public/files - вы тут',
				jwt: body.jwt,
				email: body.email,
			});
		} catch (error) {
			this.logger.log(`[user controller] error remove dir`);
			console.log(error);
			res.render('pages/admin', {
				message: 'root/public/files - вы тут',
				jwt: body.jwt,
				email: body.email,
			});
		}
	}

	async upload(
		req: Request<{}, {}, UserUploadDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			if (req.files) {
				const dataFile = req.files.dataFile as UploadedFile;
				const pathFile = await this.fileService.uploadAdminFile(dataFile, req.body.path);
				this.logger.log(`[user controller] upload ${pathFile}`);
				res.render('pages/admin', {
					message: 'root/public/files - вы тут',
					jwt: req.body.jwt,
					email: req.body.email,
				});
			}
		} catch (error) {
			this.logger.log(`[user controller] error upload file`);
			console.log(error);
			res.render('pages/admin', {
				message: 'root/public/files - вы тут',
				jwt: req.body.jwt,
				email: req.body.email,
			});
		}
	}

	async download(
		{ body }: Request<{}, {}, UserDownloadDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const file = await this.fileService.getPathFile(body.path);
			res.download(file);
			this.logger.log(`[user controller] download ${file}`);
			// res.render('pages/admin', {
			// 	message: 'root/public/files - вы тут',
			// 	jwt: body.jwt,
			// 	email: body.email,
			// });
		} catch (error) {
			this.logger.log(`[user controller] ошибка при загрузке файла`);
			console.log(error);
			res.render('pages/admin', {
				message: 'root/public/files - вы тут',
				jwt: body.jwt,
				email: body.email,
			});
		}
	}

	start(req: Request, res: Response, next: NextFunction): void {
		this.logger.log('[user controller] load login page');
		res.render('pages/login', { message: 'авторизуйтесь либо зарегистрируйтесь' });
	}
	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (body.unvalidate) {
			this.logger.log('[user controller] don`t validate go to login page');
			this.unvalidateRender(body, res, 'pages/login');
		} else {
			if (await this.userService.validateUser(body)) {
				await this.userService.clearUser(body.email);
				const jwt = await this.signJWT(body.email, this.configeService.get('SECRET'));
				if (body.email == 'tcherenkovskiy@gmail.com') {
					this.logger.log('[user controller] user login, go to the admin page');
					res.render('pages/admin', {
						message: 'root/public/files - вы тут',
						jwt,
						email: body.email,
					});
				} else {
					this.logger.log('[user controller] user login, go to the general page');
					res.render('pages/general', {
						message: 'введите общие данные по буровой установке и месторождению',
						jwt,
						email: body.email,
					});
				}
			} else {
				this.logger.log('[user controller] user don`t validate for login');
				res.render('pages/login', {
					message: 'неверный логин или пароль, попробуйте снова',
				});
			}
		}
	}
	register(req: Request, res: Response, next: NextFunction): void {
		this.logger.log('[user controller] go to the register page');
		res.render('pages/register', {
			message: 'зарегистрируйтесь и перейдите к авторизации',
		});
	}
	async registration(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (body.unvalidate) {
			this.unvalidateRender(body, res, 'pages/register');
		} else {
			const newUser = await this.userService.createUser(body);
			if (!newUser) {
				this.logger.warn('[user controller] don`t create user');
				res.render('pages/register', {
					message: 'Такой пользователь существует, попробуйте еще раз',
				});
			} else {
				this.logger.log('[user controller] go to the login page');
				res.render('pages/login', {
					message: 'вы зарегистрировались, теперь авторизуйтесь',
				});
			}
		}
	}
	info(req: Request, res: Response, next: NextFunction): void {
		return;
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					} else if (token) {
						resolve(token);
					}
				},
			);
		});
	}
}
