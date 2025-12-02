import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class HttpClientUtil {
	private static axiosInstance: AxiosInstance = axios.create({
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	static get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.get<T>(url, config);
	}

	static post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.post<T>(url, data, config);
	}

	static put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.put<T>(url, data, config);
	}

	static delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.delete<T>(url, config);
	}

	static patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return this.axiosInstance.patch<T>(url, data, config);
	}

	static setBaseURL(baseURL: string): void {
		this.axiosInstance.defaults.baseURL = baseURL;
	}

	static setAuthHeader(token: string): void {
		this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}
}
