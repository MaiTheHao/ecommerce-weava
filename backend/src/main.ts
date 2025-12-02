import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { GlobalLoggingInterceptor } from './common/interceptors/global-logging.interceptor';

function isProd(): boolean {
	return (process.env.NODE_ENV?.replace(/"/g, '') || 'development') === 'production';
}

async function bootstrap() {
	const logger = new ConsoleLogger({
		timestamp: true,
		logLevels: isProd() ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose'],
	});

	const app = await NestFactory.create(AppModule, { logger });

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
		}),
	);

	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalInterceptors(new GlobalLoggingInterceptor());

	app.enableCors();
	app.use(cookieParser());

	await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();
