import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/service';
import { User, UserStatus, Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Tạo user mới
	 */
	async create(data: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({ data });
	}

	/**
	 * Tìm user theo ID
	 */
	async findById(id: number): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { id },
		});
	}

	/**
	 * Tìm user theo email
	 */
	async findByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}

	/**
	 * Tìm user theo email kèm roles và permissions (dùng cho authentication)
	 */
	async findByEmailWithRoles(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
			include: {
				roles: {
					include: {
						role: {
							include: {
								permissions: {
									include: {
										permission: true,
									},
								},
							},
						},
					},
				},
			},
		});
	}

	/**
	 * Tìm user theo ID kèm roles và permissions
	 */
	async findByIdWithRoles(id: number) {
		return this.prisma.user.findUnique({
			where: { id },
			include: {
				roles: {
					include: {
						role: {
							include: {
								permissions: {
									include: {
										permission: true,
									},
								},
							},
						},
					},
				},
			},
		});
	}

	/**
	 * Cập nhật user
	 */
	async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
		return this.prisma.user.update({
			where: { id },
			data,
		});
	}

	/**
	 * Cập nhật status user
	 */
	async updateStatus(id: number, status: UserStatus): Promise<User> {
		return this.prisma.user.update({
			where: { id },
			data: { status },
		});
	}

	/**
	 * Xóa user (soft delete bằng cách update status)
	 */
	async softDelete(id: number): Promise<User> {
		return this.updateStatus(id, UserStatus.BANNED);
	}

	/**
	 * Kiểm tra email đã tồn tại chưa
	 */
	async existsByEmail(email: string): Promise<boolean> {
		const count = await this.prisma.user.count({
			where: { email },
		});
		return count > 0;
	}

	/**
	 * Lấy danh sách user với phân trang
	 */
	async findMany(params: { skip?: number; take?: number; where?: Prisma.UserWhereInput; orderBy?: Prisma.UserOrderByWithRelationInput }) {
		const { skip, take, where, orderBy } = params;
		return this.prisma.user.findMany({
			skip,
			take,
			where,
			orderBy,
			select: {
				id: true,
				avatar: true,
				name: true,
				email: true,
				phone: true,
				status: true,
				is_email_verified: true,
				created_at: true,
				updated_at: true,
			},
		});
	}

	/**
	 * Đếm số lượng user
	 */
	async count(where?: Prisma.UserWhereInput): Promise<number> {
		return this.prisma.user.count({ where });
	}

	/**
	 * Cập nhật refresh token cho user
	 */
	async createRefreshToken(userId: number, tokenId: string): Promise<void> {
		await this.prisma.userRefreshToken.create({
			data: {
				id: tokenId,
				user_id: userId,
			},
		});
	}

	/**
	 * Tìm refresh token
	 */
	async findRefreshToken(tokenId: string) {
		return this.prisma.userRefreshToken.findUnique({
			where: { id: tokenId },
			include: { user: true },
		});
	}

	/**
	 * Revoke refresh token
	 */
	async revokeRefreshToken(tokenId: string): Promise<void> {
		await this.prisma.userRefreshToken.update({
			where: { id: tokenId },
			data: {
				is_invoked: true,
				invoked_at: new Date(),
			},
		});
	}

	/**
	 * Revoke tất cả refresh tokens của user
	 */
	async revokeAllRefreshTokens(userId: number): Promise<void> {
		await this.prisma.userRefreshToken.updateMany({
			where: {
				user_id: userId,
				is_invoked: false,
			},
			data: {
				is_invoked: true,
				invoked_at: new Date(),
			},
		});
	}

	/**
	 * Xóa refresh tokens đã hết hạn
	 */
	async deleteExpiredRefreshTokens(beforeDate: Date): Promise<void> {
		await this.prisma.userRefreshToken.deleteMany({
			where: {
				created_at: {
					lt: beforeDate,
				},
			},
		});
	}
}
