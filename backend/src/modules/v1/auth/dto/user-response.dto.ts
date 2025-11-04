import { Exclude, Type } from 'class-transformer';
import { UserStatus } from '@prisma/client';

class PermissionDto {
	id: number;
	name: string;
	code: string;
	created_at: Date;
	updated_at: Date;
}

class RolePermissionDto {
	permission: PermissionDto;
}

class RoleDto {
	id: number;
	name: string;
	code: string;
	created_at: Date;
	updated_at: Date;

	@Type(() => RolePermissionDto)
	permissions: RolePermissionDto[];
}

class UserRoleDto {
	@Type(() => RoleDto)
	role: RoleDto;
}

export class UserResponseDto {
	id: number;
	avatar?: string;
	name: string;
	phone?: string;
	email: string;
	is_email_verified: boolean;
	status: UserStatus;
	created_at: Date;
	updated_at: Date;

	@Exclude()
	password_hashed: string;

	@Type(() => UserRoleDto)
	roles: UserRoleDto[];
}
