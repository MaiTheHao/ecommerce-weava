import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiResponseUtil } from '../utils/api-response.util';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger('GlobalExceptionFilter');

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse();
		const req = ctx.getRequest();
		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = 'Internal Server Error';

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const response = exception.getResponse();
			message = typeof response === 'object' && 'message' in response ? (response as any).message : exception.message;

			if (status >= 400 && status < 500) {
				this.logger.warn(`[${req.method}] ${req.url} - ${status} - ${message}`, exception.stack);
			} else {
				this.logger.error(`[${req.method}] ${req.url} - ${status} - ${message}`, exception.stack);
			}
		} else if ((exception as any)?.code === 'P2002') {
			status = HttpStatus.CONFLICT;
			const field = (exception as any).meta?.target?.[0] || 'unknown';
			message = `Duplicate entry for field: ${field}`;
			this.logger.warn(`[${req.method}] ${req.url} - ${status} - Prisma P2002: ${message}`);
		} else if ((exception as any)?.code === 'P2025') {
			status = HttpStatus.NOT_FOUND;
			message = 'Record not found';
			this.logger.warn(`[${req.method}] ${req.url} - ${status} - Prisma P2025: ${message}`);
		} else {
			this.logger.error(
				`[${req.method}] ${req.url} - ${status} - Unhandled exception: ${exception instanceof Error ? exception.message : String(exception)}`,
				exception instanceof Error ? exception.stack : undefined,
			);
		}

		const responseBody = ApiResponseUtil.error({
			message,
			...(process.env.NODE_ENV !== 'production' && { stack: exception instanceof Error ? exception.stack : undefined }),
		});

		res.status(status).json(responseBody);
	}
}
