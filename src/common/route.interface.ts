import { NextFunction, Router, Request, Response } from 'express';
import { IMiddleWare } from './middleware.interface';

export interface IRouteApp {
	path: string;
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
	func: (req: Request, res: Response, next: NextFunction) => void;
	middlewares?: IMiddleWare[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
