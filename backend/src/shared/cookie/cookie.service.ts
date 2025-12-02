import { Inject, Injectable, InternalServerErrorException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request, CookieOptions, Response } from 'express';
import { COOKIE_NAME, CookieName } from '../const/cookie.const';
import { EnvService } from '../env/env.service';
import { ENV_KEYS } from '@/shared/const/env.const';

@Injectable({ scope: Scope.REQUEST })
export class CookieService {
	constructor(
		@Inject(REQUEST) private readonly request: Request,
		private readonly envService: EnvService,
	) {}

	private buildCookieOptions(options?: CookieOptions): CookieOptions {
		const nodeEnv = this.envService.getOptional(ENV_KEYS.NODE_ENV);
		const secure = nodeEnv === 'production';
		return {
			httpOnly: true,
			secure,
			path: '/',
			...options,
		};
	}

	setCookie(name: CookieName, value: string, options?: CookieOptions) {
		this.response.cookie(COOKIE_NAME[name], value, this.buildCookieOptions(options));
	}

	getCookie(name: CookieName): string | undefined {
		return this.request.cookies[COOKIE_NAME[name]];
	}

	clearCookie(name: CookieName, options?: CookieOptions) {
		this.response.clearCookie(COOKIE_NAME[name], this.buildCookieOptions(options));
	}

	setRefreshTokenCookie(token: string, maxAgeMs?: number) {
		this.setCookie('REFRESH_TOKEN', token, {
			...(maxAgeMs ? { maxAge: maxAgeMs } : {}),
		});
	}

	getRefreshTokenCookie(): string | undefined {
		return this.getCookie('REFRESH_TOKEN');
	}

	clearRefreshTokenCookie() {
		this.clearCookie('REFRESH_TOKEN');
	}

	private get response(): Response {
		if (!this.request.res) {
			throw new InternalServerErrorException('Đối tượng response không khả dụng');
		}
		return this.request.res;
	}
}
