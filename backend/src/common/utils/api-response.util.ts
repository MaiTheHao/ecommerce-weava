import { HttpException, HttpStatus } from '@nestjs/common';
import { TResponse } from '../types/response.type';

export class ApiResponseUtil {
	private static createResponse<T>(data: T, message: string, success: boolean, error: any): TResponse<T> {
		return {
			success,
			data,
			message,
			timestamp: Date.now(),
			error,
		};
	}

	static success<T>(data: T, message: string = 'Request successful'): TResponse<T> {
		return this.createResponse<T>(data, message, true, null);
	}

	static error(exception: unknown): TResponse<null> {
		let message = 'Internal Server Error';
		let errorDetail: any = null;

		if (exception instanceof HttpException) {
			const res = exception.getResponse();
			if (typeof res === 'object' && res !== null) {
				const responseObj = res as any;
				message = responseObj.message && Array.isArray(responseObj.message) ? 'Validation Error' : responseObj.message || exception.message;
				errorDetail = responseObj.message || responseObj.error;
			} else {
				message = exception.message;
				errorDetail = res;
			}
		} else if (exception instanceof Error) {
			message = exception.message;
			errorDetail = exception.name;
		}

		return this.createResponse<null>(null, message, false, errorDetail);
	}
}
