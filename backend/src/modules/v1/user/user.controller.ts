import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService, UpdateUserDto } from './user.service';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { HasRoles } from '@/shared/decorators/has-roles.decorator';
import { GetUser } from '@/shared/decorators/get-user.decorator';
import { UserStatus } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	/**
	 * Lấy thông tin user hiện tại
	 */
	@Get('me')
	async getCurrentUser(@GetUser('id') userId: number) {
		return this.userService.getUserById(userId);
	}

	/**
	 * Cập nhật thông tin user hiện tại
	 */
	@Put('me')
	async updateCurrentUser(@GetUser('id') userId: number, @Body() dto: UpdateUserDto) {
		return this.userService.updateUser(userId, dto);
	}

	/**
	 * Đổi mật khẩu
	 */
	@Post('me/change-password')
	@HttpCode(HttpStatus.NO_CONTENT)
	async changePassword(@GetUser('id') userId: number, @Body() dto: { oldPassword: string; newPassword: string }) {
		await this.userService.changePassword(userId, dto.oldPassword, dto.newPassword);
	}

	/**
	 * Revoke tất cả refresh tokens của user hiện tại
	 */
	@Post('me/revoke-tokens')
	@HttpCode(HttpStatus.NO_CONTENT)
	async revokeAllTokens(@GetUser('id') userId: number) {
		await this.userService.revokeAllRefreshTokens(userId);
	}

	// Admin endpoints

	/**
	 * Lấy danh sách user (Admin only)
	 */
	@Get()
	@UseGuards(RolesGuard)
	@HasRoles('ADMIN')
	async getUsers(
		@Query('page', ParseIntPipe) page?: number,
		@Query('limit', ParseIntPipe) limit?: number,
		@Query('status') status?: UserStatus,
		@Query('search') search?: string,
	) {
		return this.userService.getUsers({ page, limit, status, search });
	}

	/**
	 * Lấy thông tin user theo ID (Admin only)
	 */
	@Get(':id')
	@UseGuards(RolesGuard)
	@HasRoles('ADMIN')
	async getUserById(@Param('id', ParseIntPipe) id: number) {
		return this.userService.getUserById(id);
	}

	/**
	 * Cập nhật status user (Admin only)
	 */
	@Put(':id/status')
	@UseGuards(RolesGuard)
	@HasRoles('ADMIN')
	async updateUserStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: { status: UserStatus }) {
		return this.userService.updateUserStatus(id, dto.status);
	}

	/**
	 * Xóa user (Admin only)
	 */
	@Delete(':id')
	@UseGuards(RolesGuard)
	@HasRoles('ADMIN')
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteUser(@Param('id', ParseIntPipe) id: number) {
		await this.userService.deleteUser(id);
	}
}
