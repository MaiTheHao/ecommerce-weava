import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { GetUser } from '@/shared/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * Đăng ký
	 */
	@Post('register')
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	/**
	 * Đăng nhập
	 */
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	/**
	 * Refresh token
	 */
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(@Body() body: { refresh_token: string }) {
		return this.authService.refreshToken(body.refresh_token);
	}

	/**
	 * Đăng xuất
	 */
	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	async logout(@Body() body: { refresh_token: string }) {
		await this.authService.logout(body.refresh_token);
	}

	/**
	 * Revoke tất cả tokens
	 */
	@Post('revoke-all')
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	async revokeAll(@GetUser('id') userId: number) {
		await this.authService.revokeAllTokens(userId);
	}
}
