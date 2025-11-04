import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// Create permissions
	const permissions = [
		{ name: 'Create Product', code: 'CREATE_PRODUCT' },
		{ name: 'Read Product', code: 'READ_PRODUCT' },
		{ name: 'Update Product', code: 'UPDATE_PRODUCT' },
		{ name: 'Delete Product', code: 'DELETE_PRODUCT' },
		{ name: 'Create Order', code: 'CREATE_ORDER' },
		{ name: 'Read Order', code: 'READ_ORDER' },
		{ name: 'Update Order', code: 'UPDATE_ORDER' },
		{ name: 'Delete Order', code: 'DELETE_ORDER' },
		{ name: 'Manage Users', code: 'MANAGE_USERS' },
		{ name: 'Manage Roles', code: 'MANAGE_ROLES' },
	];

	for (const perm of permissions) {
		await prisma.permission.upsert({
			where: { code: perm.code },
			update: {},
			create: perm,
		});
	}

	// Create roles
	const roles = [
		{ name: 'User', code: 'USER' },
		{ name: 'Admin', code: 'ADMIN' },
	];

	for (const role of roles) {
		await prisma.role.upsert({
			where: { code: role.code },
			update: {},
			create: role,
		});
	}

	// Assign permissions to roles
	const adminRole = await prisma.role.findUnique({ where: { code: 'ADMIN' } });
	const userRole = await prisma.role.findUnique({ where: { code: 'USER' } });

	if (adminRole) {
		const allPermissions = await prisma.permission.findMany();
		for (const perm of allPermissions) {
			await prisma.rolePermission.upsert({
				where: {
					role_id_permission_id: {
						role_id: adminRole.id,
						permission_id: perm.id,
					},
				},
				update: {},
				create: {
					role_id: adminRole.id,
					permission_id: perm.id,
				},
			});
		}
	}

	if (userRole) {
		const userPermissions = ['READ_PRODUCT', 'CREATE_ORDER', 'READ_ORDER'];
		for (const code of userPermissions) {
			const perm = await prisma.permission.findUnique({ where: { code } });
			if (perm) {
				await prisma.rolePermission.upsert({
					where: {
						role_id_permission_id: {
							role_id: userRole.id,
							permission_id: perm.id,
						},
					},
					update: {},
					create: {
						role_id: userRole.id,
						permission_id: perm.id,
					},
				});
			}
		}
	}

	console.log('Seeding completed');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
