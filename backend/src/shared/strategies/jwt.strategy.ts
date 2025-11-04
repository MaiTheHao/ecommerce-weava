import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRepository } from '@/modules/v1/auth/auth.repository';
import * as env from '@/config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authRepository: AuthRepository) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: env.default().jwt.secret,
		});
	}

	async validate(payload: any) {
		const user = await this.authRepository.findUserByEmail(payload.email);
		if (!user) {
			throw new UnauthorizedException();
		}
		return { sub: user.id, email: user.email };
	}
}
