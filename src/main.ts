import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './App';
import { AuthMiddleWare } from './common/auth.middleware';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { ExceptionFilter } from './error/exception.filter';
import { IExceptionFilter } from './error/exception.fiter.interface';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { ReportController } from './report/report.controller';
import { IReportController } from './report/report.controller.interface';
import { ReportRepository } from './report/report.repository';
import { TYPES } from './types';
import { UserController } from './user/user.controller';
import { IUserController } from './user/user.controller.interface';
import { UserRepository } from './user/user.repository';
import { IUserRepository } from './user/user.repository.interace';
import { UserService } from './user/user.service';
import { IUserService } from './user/user.service.interface';
import { IReportRepository } from './report/report.repository.interface';
import { IReportService } from './report/report.service.interface';
import { ReportService } from './report/report.service';
import { IFileService } from './common/file.service.interface';
import { FileService } from './common/file.service';
import { ReportBuilder } from './report/util/reportBilder';

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
	bind<AuthMiddleWare>(TYPES.AuthMiddleWare).to(AuthMiddleWare);
	bind<IReportRepository>(TYPES.IReportRepository).to(ReportRepository);
	bind<IReportService>(TYPES.IReportService).to(ReportService);
	bind<IFileService>(TYPES.IFileService).to(FileService);
	bind<ReportBuilder>(TYPES.ReportBuilder).to(ReportBuilder);
});

async function bootstrap(): Promise<IBootstrapReturn> {
	const appContainer = new Container();
	appContainer.load(appBinding);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
