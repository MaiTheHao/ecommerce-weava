import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface CreateUserDto {
	email: string;
	password: string;
	name: string;
	phone?: string;
	avatar?: string;
}

export interface UpdateUserDto {
	name?: string;
	phone?: string;
	avatar?: string;
}

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	/**
	 * Tạo user mới (dùng cho registration)
	 */
	async createUser(dto: CreateUserDto): Promise<User> {
		// Kiểm tra email đã tồn tại
		const existingUser = await this.userRepository.findByEmail(dto.email);
		if (existingUser) {
			throw new ConflictException('Email đã được sử dụng');
		}

		// Hash password
		const passwordHashed = await bcrypt.hash(dto.password, 12);

		// Tạo user
		return this.userRepository.create({
			email: dto.email,
			password_hashed: passwordHashed,
			name: dto.name,
			phone: dto.phone,
			avatar: dto.avatar,
			status: UserStatus.ACTIVE,
		});
	}

	/**
	 * Lấy thông tin user theo ID
	 */
	async getUserById(id: number): Promise<User> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new NotFoundException('Không tìm thấy người dùng');
		}
		return user;
	}

	/**
	 * Lấy thông tin user theo email
	 */
	async getUserByEmail(email: string): Promise<User | null> {
		return this.userRepository.findByEmail(email);
	}

	/**
	 * Lấy user với roles và permissions (dùng cho auth)
	 */
	async getUserByEmailWithRoles(email: string) {
		return this.userRepository.findByEmailWithRoles(email);
	}

	/**
	 * Lấy user với roles và permissions theo ID
	 */
	async getUserByIdWithRoles(id: number) {
		const user = await this.userRepository.findByIdWithRoles(id);
		if (!user) {
			throw new NotFoundException('Không tìm thấy người dùng');
		}
		return user;
	}

	/**
	 * Cập nhật thông tin user
	 */
	async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
		await this.getUserById(id); // Kiểm tra user tồn tại
		return this.userRepository.update(id, dto);
	}

	/**
	 * Đổi mật khẩu
	 */
	async changePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
		const user = await this.getUserById(id);

		// Kiểm tra mật khẩu cũ
		const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hashed);
		if (!isPasswordValid) {
			throw new ConflictException('Mật khẩu cũ không đúng');
		}

		// Hash mật khẩu mới
		const passwordHashed = await bcrypt.hash(newPassword, 12);

		await this.userRepository.update(id, {
			password_hashed: passwordHashed,
		});
	}

	/**
	 * Cập nhật status user
	 */
	async updateUserStatus(id: number, status: UserStatus): Promise<User> {
		await this.getUserById(id);
		return this.userRepository.updateStatus(id, status);
	}

	/**
	 * Xóa user (soft delete)
	 */
	async deleteUser(id: number): Promise<User> {
		await this.getUserById(id);
		return this.userRepository.softDelete(id);
	}

	/**
	 * Lấy danh sách user với phân trang
	 */
	async getUsers(params: { page?: number; limit?: number; status?: UserStatus; search?: string }) {
		const { page = 1, limit = 10, status, search } = params;
		const skip = (page - 1) * limit;

		const where: any = {};
		if (status) {
			where.status = status;
		}
		if (search) {
			where.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ email: { contains: search, mode: 'insensitive' } },
				{ phone: { contains: search, mode: 'insensitive' } },
			];
		}

		const [users, total] = await Promise.all([
			this.userRepository.findMany({
				skip,
				take: limit,
				where,
				orderBy: { created_at: 'desc' },
			}),
			this.userRepository.count(where),
		]);

		return {
			data: users,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};
	}

	/**
	 * Xác thực email
	 */
	async verifyEmail(id: number): Promise<User> {
		return this.userRepository.update(id, {
			is_email_verified: true,
		});
	}

	/**
	 * Kiểm tra mật khẩu (dùng cho login)
	 */
	async validatePassword(user: User, password: string): Promise<boolean> {
		return bcrypt.compare(password, user.password_hashed);
	}

	// Refresh Token Management (dùng cho AuthModule)

	async createRefreshToken(userId: number, tokenId: string): Promise<void> {
		await this.userRepository.createRefreshToken(userId, tokenId);
	}

	async findRefreshToken(tokenId: string) {
		return this.userRepository.findRefreshToken(tokenId);
	}

	async revokeRefreshToken(tokenId: string): Promise<void> {
		await this.userRepository.revokeRefreshToken(tokenId);
	}

	async revokeAllRefreshTokens(userId: number): Promise<void> {
		await this.userRepository.revokeAllRefreshTokens(userId);
	}
}
