import { Global, Module } from '@nestjs/common';
import { CookieService } from './cookie.service';
import { EnvModule } from '../env/env.module';

@Global()
@Module({
	imports: [EnvModule],
	providers: [CookieService],
	exports: [CookieService],
})
export class CookieModule {}
