import { NextFunction, Request, Response, Router } from 'express';

export interface IUserController {
	router: Router;
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
	info: (req: Request, res: Response, next: NextFunction) => void;
	input: (req: Request, res: Response, next: NextFunction) => void;
	report: (req: Request, res: Response, next: NextFunction) => void;
}
