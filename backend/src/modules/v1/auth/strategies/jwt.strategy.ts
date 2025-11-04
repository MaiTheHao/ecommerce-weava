import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@/modules/v1/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>('JWT_SECRET'),
			ignoreExpiration: false,
		});
	}

	async validate(payload: { sub: number; email: string }) {
		const user = await this.userService.getUserByIdWithRoles(payload.sub);
		if (!user || user.status !== 'ACTIVE') {
			throw new UnauthorizedException('Tài khoản không hợp lệ');
		}

		// Trả về user object để inject vào request
		return {
			id: user.id,
			email: user.email,
			roles: user.roles.map((ur) => ur.role.code),
		};
	}
}
