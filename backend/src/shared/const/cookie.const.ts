export const COOKIE_NAME = {
	REFRESH_TOKEN: 'refresh_token',
} as const;

export type CookieName = keyof typeof COOKIE_NAME;
