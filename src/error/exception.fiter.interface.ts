import { NextFunction, Request, Response } from 'express';
import { HttpError } from './http.error';

export interface IExceptionFilter {
	catch: (err: Error | HttpError, req: Request, res: Response, next: NextFunction) => void;
}
