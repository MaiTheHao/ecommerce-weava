import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/service';
import { Role, Permission, Prisma } from '@prisma/client';

@Injectable()
export class RbacRepository {
	constructor(private readonly prisma: PrismaService) {}

	// Role operations

	async findRoleById(id: number) {
		return this.prisma.role.findUnique({
			where: { id },
			include: {
				permissions: {
					include: {
						permission: true,
					},
				},
			},
		});
	}

	async findRoleByCode(code: string) {
		return this.prisma.role.findUnique({
			where: { code },
			include: {
				permissions: {
					include: {
						permission: true,
					},
				},
			},
		});
	}

	async findAllRoles() {
		return this.prisma.role.findMany({
			include: {
				permissions: {
					include: {
						permission: true,
					},
				},
			},
		});
	}

	async createRole(data: Prisma.RoleCreateInput): Promise<Role> {
		return this.prisma.role.create({ data });
	}

	async updateRole(id: number, data: Prisma.RoleUpdateInput): Promise<Role> {
		return this.prisma.role.update({
			where: { id },
			data,
		});
	}

	async deleteRole(id: number): Promise<Role> {
		return this.prisma.role.delete({
			where: { id },
		});
	}

	// Permission operations

	async findPermissionById(id: number): Promise<Permission | null> {
		return this.prisma.permission.findUnique({
			where: { id },
		});
	}

	async findPermissionByCode(code: string): Promise<Permission | null> {
		return this.prisma.permission.findUnique({
			where: { code },
		});
	}

	async findAllPermissions(): Promise<Permission[]> {
		return this.prisma.permission.findMany();
	}

	async createPermission(data: Prisma.PermissionCreateInput): Promise<Permission> {
		return this.prisma.permission.create({ data });
	}

	async updatePermission(id: number, data: Prisma.PermissionUpdateInput): Promise<Permission> {
		return this.prisma.permission.update({
			where: { id },
			data,
		});
	}

	async deletePermission(id: number): Promise<Permission> {
		return this.prisma.permission.delete({
			where: { id },
		});
	}

	// Role-Permission operations

	async assignPermissionToRole(roleId: number, permissionId: number): Promise<void> {
		await this.prisma.rolePermission.create({
			data: {
				role_id: roleId,
				permission_id: permissionId,
			},
		});
	}

	async removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
		await this.prisma.rolePermission.delete({
			where: {
				role_id_permission_id: {
					role_id: roleId,
					permission_id: permissionId,
				},
			},
		});
	}

	// User-Role operations

	async assignRoleToUser(userId: number, roleId: number): Promise<void> {
		await this.prisma.userRole.create({
			data: {
				user_id: userId,
				role_id: roleId,
			},
		});
	}

	async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
		await this.prisma.userRole.delete({
			where: {
				user_id_role_id: {
					user_id: userId,
					role_id: roleId,
				},
			},
		});
	}

	async getUserRoles(userId: number) {
		return this.prisma.userRole.findMany({
			where: { user_id: userId },
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
		});
	}

	/**
	 * Kiểm tra user có role không
	 */
	async userHasRole(userId: number, roleCode: string): Promise<boolean> {
		const count = await this.prisma.userRole.count({
			where: {
				user_id: userId,
				role: {
					code: roleCode,
				},
			},
		});
		return count > 0;
	}

	/**
	 * Kiểm tra user có permission không
	 */
	async userHasPermission(userId: number, permissionCode: string): Promise<boolean> {
		const count = await this.prisma.userRole.count({
			where: {
				user_id: userId,
				role: {
					permissions: {
						some: {
							permission: {
								code: permissionCode,
							},
						},
					},
				},
			},
		});
		return count > 0;
	}
}
