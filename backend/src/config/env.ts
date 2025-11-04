export default () => ({
	database: {
		url: process.env.DATABASE_URL,
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRES_IN || '15m',
		refreshSecret: process.env.REFRESH_JWT_SECRET,
		refreshExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '7d',
	},
});
