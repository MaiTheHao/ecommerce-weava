import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@/core/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/v1/auth/auth.module';
import { UserModule } from './modules/v1/user/user.module';
import { RbacModule } from './modules/v1/rbac/rbac.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, UserModule, RbacModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
