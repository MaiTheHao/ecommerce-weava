import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacRepository } from './rbac.repository';
import { PrismaModule } from '@/core/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [RbacService, RbacRepository],
	exports: [RbacService], // Export để dùng cho Guards và các module khác
})
export class RbacModule {}
