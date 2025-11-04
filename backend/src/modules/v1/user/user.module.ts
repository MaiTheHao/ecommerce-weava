import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaModule } from '@/core/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [UserController],
	providers: [UserService, UserRepository],
	exports: [UserService], // Export để AuthModule và các module khác sử dụng
})
export class UserModule {}
