import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@common/database/prisma/prisma.module';
import { EnvModule } from '@/shared/env/env.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, EnvModule],
	controllers: [AppController],
	providers: [Logger, AppService],
})
export class AppModule {}
