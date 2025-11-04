import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@/modules/v1/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	/**
	 * Đăng ký user mới
	 */
	async register(dto: RegisterDto) {
		// Tạo user thông qua UserService
		const user = await this.userService.createUser(dto);

		// Tạo tokens
		const tokens = await this.generateTokens(user.id, user.email);

		return {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
			...tokens,
		};
	}

	/**
	 * Đăng nhập
	 */
	async login(dto: LoginDto) {
		// Lấy user với roles từ UserService
		const user = await this.userService.getUserByEmailWithRoles(dto.email);
		if (!user) {
			throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
		}

		// Validate password
		const isPasswordValid = await this.userService.validatePassword(user, dto.password);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
		}

		// Kiểm tra status
		if (user.status !== 'ACTIVE') {
			throw new UnauthorizedException('Tài khoản đã bị khóa');
		}

		// Tạo tokens
		const tokens = await this.generateTokens(user.id, user.email);

		return {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				roles: user.roles.map((ur) => ur.role.code),
			},
			...tokens,
		};
	}

	/**
	 * Refresh access token
	 */
	async refreshToken(refreshToken: string) {
		try {
			// Verify refresh token
			const payload = this.jwtService.verify(refreshToken, {
				secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
			});

			// Kiểm tra refresh token trong DB
			const tokenData = await this.userService.findRefreshToken(payload.jti);
			if (!tokenData || tokenData.is_invoked) {
				throw new UnauthorizedException('Refresh token không hợp lệ');
			}

			// Kiểm tra user còn active không
			if (tokenData.user.status !== 'ACTIVE') {
				throw new UnauthorizedException('Tài khoản đã bị khóa');
			}

			// Revoke refresh token cũ
			await this.userService.revokeRefreshToken(payload.jti);

			// Tạo tokens mới
			return this.generateTokens(tokenData.user.id, tokenData.user.email);
		} catch (error) {
			throw new UnauthorizedException('Refresh token không hợp lệ');
		}
	}

	/**
	 * Đăng xuất (revoke refresh token)
	 */
	async logout(refreshToken: string): Promise<void> {
		try {
			const payload = this.jwtService.verify(refreshToken, {
				secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
			});

			await this.userService.revokeRefreshToken(payload.jti);
		} catch (error) {
			// Ignore errors nếu token không hợp lệ
		}
	}

	/**
	 * Revoke tất cả refresh tokens của user
	 */
	async revokeAllTokens(userId: number): Promise<void> {
		await this.userService.revokeAllRefreshTokens(userId);
	}

	/**
	 * Tạo access token và refresh token
	 */
	private async generateTokens(userId: number, email: string) {
		const tokenId = uuidv4();

		// Tạo access token
		const accessToken = this.jwtService.sign(
			{ sub: userId, email },
			{
				secret: this.configService.get<string>('JWT_SECRET'),
				expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
			},
		);

		// Tạo refresh token
		const refreshToken = this.jwtService.sign(
			{ sub: userId, email, jti: tokenId },
			{
				secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
				expiresIn: this.configService.get<string>('REFRESH_JWT_EXPIRES_IN', '7d'),
			},
		);

		// Lưu refresh token vào DB
		await this.userService.createRefreshToken(userId, tokenId);

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
			expires_in: this.configService.get<number>('JWT_EXPIRES_IN', 900), // seconds
		};
	}
}
