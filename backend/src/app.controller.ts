import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'nest-keycloak-connect';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly logger: Logger,
	) {}

	@Get('hello')
	@Public()
	getHello(): string {
		return 'Xin chào từ Weava Backend!';
	}

	@Get('protected')
	getProtectedData(): string {
		return 'Bạn chỉ thấy điều này NẾU có token hợp lệ!';
	}
}
