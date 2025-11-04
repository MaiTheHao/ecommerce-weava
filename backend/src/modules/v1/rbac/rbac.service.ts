import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { RbacRepository } from './rbac.repository';
import { Role, Permission } from '@prisma/client';

export interface CreateRoleDto {
	name: string;
	code: string;
}

export interface UpdateRoleDto {
	name?: string;
	code?: string;
}

export interface CreatePermissionDto {
	name: string;
	code: string;
}

export interface UpdatePermissionDto {
	name?: string;
	code?: string;
}

@Injectable()
export class RbacService {
	constructor(private readonly rbacRepository: RbacRepository) {}

	// Role Management

	async createRole(dto: CreateRoleDto): Promise<Role> {
		const existingRole = await this.rbacRepository.findRoleByCode(dto.code);
		if (existingRole) {
			throw new ConflictException('Mã vai trò đã tồn tại');
		}

		return this.rbacRepository.createRole(dto);
	}

	async getRoleById(id: number) {
		const role = await this.rbacRepository.findRoleById(id);
		if (!role) {
			throw new NotFoundException('Không tìm thấy vai trò');
		}
		return role;
	}

	async getRoleByCode(code: string) {
		const role = await this.rbacRepository.findRoleByCode(code);
		if (!role) {
			throw new NotFoundException('Không tìm thấy vai trò');
		}
		return role;
	}

	async getAllRoles() {
		return this.rbacRepository.findAllRoles();
	}

	async updateRole(id: number, dto: UpdateRoleDto): Promise<Role> {
		await this.getRoleById(id);

		if (dto.code) {
			const existingRole = await this.rbacRepository.findRoleByCode(dto.code);
			if (existingRole && existingRole.id !== id) {
				throw new ConflictException('Mã vai trò đã tồn tại');
			}
		}

		return this.rbacRepository.updateRole(id, dto);
	}

	async deleteRole(id: number): Promise<Role> {
		await this.getRoleById(id);
		return this.rbacRepository.deleteRole(id);
	}

	// Permission Management

	async createPermission(dto: CreatePermissionDto): Promise<Permission> {
		const existingPermission = await this.rbacRepository.findPermissionByCode(dto.code);
		if (existingPermission) {
			throw new ConflictException('Mã quyền hạn đã tồn tại');
		}

		return this.rbacRepository.createPermission(dto);
	}

	async getPermissionById(id: number): Promise<Permission> {
		const permission = await this.rbacRepository.findPermissionById(id);
		if (!permission) {
			throw new NotFoundException('Không tìm thấy quyền hạn');
		}
		return permission;
	}

	async getPermissionByCode(code: string): Promise<Permission> {
		const permission = await this.rbacRepository.findPermissionByCode(code);
		if (!permission) {
			throw new NotFoundException('Không tìm thấy quyền hạn');
		}
		return permission;
	}

	async getAllPermissions(): Promise<Permission[]> {
		return this.rbacRepository.findAllPermissions();
	}

	async updatePermission(id: number, dto: UpdatePermissionDto): Promise<Permission> {
		await this.getPermissionById(id);

		if (dto.code) {
			const existingPermission = await this.rbacRepository.findPermissionByCode(dto.code);
			if (existingPermission && existingPermission.id !== id) {
				throw new ConflictException('Mã quyền hạn đã tồn tại');
			}
		}

		return this.rbacRepository.updatePermission(id, dto);
	}

	async deletePermission(id: number): Promise<Permission> {
		await this.getPermissionById(id);
		return this.rbacRepository.deletePermission(id);
	}

	// Role-Permission Assignment

	async assignPermissionToRole(roleId: number, permissionId: number): Promise<void> {
		await this.getRoleById(roleId);
		await this.getPermissionById(permissionId);

		await this.rbacRepository.assignPermissionToRole(roleId, permissionId);
	}

	async removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
		await this.rbacRepository.removePermissionFromRole(roleId, permissionId);
	}

	// User-Role Assignment

	async assignRoleToUser(userId: number, roleId: number): Promise<void> {
		await this.getRoleById(roleId);
		await this.rbacRepository.assignRoleToUser(userId, roleId);
	}

	async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
		await this.rbacRepository.removeRoleFromUser(userId, roleId);
	}

	async getUserRoles(userId: number) {
		return this.rbacRepository.getUserRoles(userId);
	}

	// Authorization Checks

	async userHasRole(userId: number, roleCode: string): Promise<boolean> {
		return this.rbacRepository.userHasRole(userId, roleCode);
	}

	async userHasPermission(userId: number, permissionCode: string): Promise<boolean> {
		return this.rbacRepository.userHasPermission(userId, permissionCode);
	}

	async userHasAnyRole(userId: number, roleCodes: string[]): Promise<boolean> {
		for (const code of roleCodes) {
			if (await this.userHasRole(userId, code)) {
				return true;
			}
		}
		return false;
	}

	async userHasAllRoles(userId: number, roleCodes: string[]): Promise<boolean> {
		for (const code of roleCodes) {
			if (!(await this.userHasRole(userId, code))) {
				return false;
			}
		}
		return true;
	}
}
