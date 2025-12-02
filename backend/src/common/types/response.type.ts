export type TResponse<T = any> = {
	success: boolean;
	data?: T;
	message: string;
	timestamp: number;
	error?: any;
};
