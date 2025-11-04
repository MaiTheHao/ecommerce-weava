import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '@/modules/v1/user/user.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
			secretOrKey: configService.get<string>('REFRESH_JWT_SECRET'),
			ignoreExpiration: false,
		});
	}

	async validate(payload: { sub: number; email: string; jti: string }) {
		const tokenData = await this.userService.findRefreshToken(payload.jti);
		if (!tokenData || tokenData.is_invoked) {
			throw new UnauthorizedException('Refresh token không hợp lệ');
		}

		if (tokenData.user.status !== 'ACTIVE') {
			throw new UnauthorizedException('Tài khoản không hợp lệ');
		}

		return {
			id: tokenData.user.id,
			email: tokenData.user.email,
		};
	}
}
