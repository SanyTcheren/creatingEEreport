import { NextFunction, Request, Response, Router } from 'express';

export interface IReportController {
	router: Router;
	input: (req: Request, res: Response, next: NextFunction) => void;
	report: (req: Request, res: Response, next: NextFunction) => void;
	general: (req: Request, res: Response, next: NextFunction) => void;
	oilwell: (req: Request, res: Response, next: NextFunction) => void;
	save: (req: Request, res: Response, next: NextFunction) => void;
}
