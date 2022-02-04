import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './App';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { ExceptionFilter } from './error/exception.filter';
import { IExceptionFilter } from './error/exception.fiter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { ReportController } from './report/report.controller';
import { IReportController } from './report/report.controller.interface';
import { TYPES } from './types';
import { UserController } from './user/user.controller';
import { IUserController } from './user/user.controller.interface';
import { UserRepository } from './user/user.repository';
import { IUserRepository } from './user/user.repository.interace';
import { UserService } from './user/user.service';
import { IUserService } from './user/user.service.interface';

interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

const appBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App).inSingletonScope();
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<IUserController>(TYPES.IUserController).to(UserController);
	bind<IReportController>(TYPES.IReportController).to(ReportController);
	bind<IUserService>(TYPES.IUserService).to(UserService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBinding);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
