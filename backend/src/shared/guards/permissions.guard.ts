import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthService } from '@/modules/v1/auth/auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private authService: AuthService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

		if (!requiredPermissions) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();

		for (const permission of requiredPermissions) {
			const hasPermission = await this.authService.hasPermission(user.sub as number, permission);
			if (!hasPermission) {
				return false;
			}
		}

		return true;
	}
}
