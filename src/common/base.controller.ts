import 'reflect-metadata';
import { Router, Response, Request } from 'express';
import { injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { ExpressReturnType, IRouteApp } from './route.interface';
import { ValidateDto } from '../types/validateDto';

@injectable()
export abstract class BaseController {
	private readonly _router;

	constructor(protected logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected bindRotes(routes: IRouteApp[]): void {
		for (const route of routes) {
			this.logger.log(`[bindRotes] ${route.method} ${route.path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipline = middleware ? [...middleware, handler] : handler;
			this._router[route.method](route.path, pipline);
		}
	}

	public unvalidateRender(body: ValidateDto, res: Response, page: string): void {
		this.logger.warn(`[base controller] ${body.unvalidate}`);
		res.render(page, { message: `Необходимо исправить данные. ${body.unvalidate}` });
	}

	public created(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	public send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}
}
