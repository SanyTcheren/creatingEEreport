import { NextFunction, Request, Response, Router } from 'express';

export interface IReportController {
	router: Router;
	general: (req: Request, res: Response, next: NextFunction) => void;
	oilwell: (req: Request, res: Response, next: NextFunction) => void;
	addwell: (req: Request, res: Response, next: NextFunction) => void;
	input: (req: Request, res: Response, next: NextFunction) => void;
	save: (req: Request, res: Response, next: NextFunction) => void;
}
