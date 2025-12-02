import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class GlobalLoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger('HTTP');

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp();
		const req = ctx.getRequest();
		const method = req.method;
		const url = req.url;
		const now = Date.now();

		this.logger.debug(`Incoming: [${method}] ${url} - Body: ${JSON.stringify(req.body)}`);

		return next.handle().pipe(
			tap(() => {
				const res = ctx.getResponse();
				const statusCode = res.statusCode;
				const responseTime = Date.now() - now;

				this.logger.log(`[${method}] ${url} - ${statusCode} - ${responseTime}ms`);
			}),
		);
	}
}
