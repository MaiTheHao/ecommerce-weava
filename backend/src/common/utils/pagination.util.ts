import { TPaginationBody } from '../types';

export class PaginationUtil {
	public static createPaginatedBody<T>(items: T[], total: number, page: number, limit: number): TPaginationBody<T> {
		const totalPages = Math.ceil(total / limit);
		const hasNext = page < totalPages;
		const hasPrev = page > 1;
		return {
			items,
			total,
			page,
			limit,
			totalPages,
			hasNext,
			hasPrev,
		};
	}
}
