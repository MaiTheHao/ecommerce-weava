import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthRepository } from '@/modules/v1/auth/auth.repository';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private authRepository: AuthRepository,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

		if (!requiredRoles) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();

		const userWithRoles = await this.authRepository.findUserWithRoles(user.sub as number);
		if (!userWithRoles) {
			return false;
		}

		const userRoles = (userWithRoles as any).roles.map((ur: any) => ur.role.code);

		return requiredRoles.some((role) => userRoles.includes(role));
	}
}
