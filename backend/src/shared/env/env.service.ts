import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_KEYS, EnvKey } from '../const/env.const';

@Injectable()
export class EnvService {
	constructor(private readonly configService: ConfigService) {}

	get(key: EnvKey, defaultValue?: string): string {
		const envKey = ENV_KEYS[key];
		const value = this.configService.get<string>(envKey);
		if (typeof value === 'undefined') {
			if (typeof defaultValue !== 'undefined') {
				return defaultValue;
			}
			throw new Error(`Environment variable ${ENV_KEYS[key]} is not configured`);
		}
		return value;
	}

	getNumber(key: EnvKey): number {
		const value = this.get(key);
		const num = Number(value);
		if (isNaN(num)) {
			throw new Error(`Environment variable ${ENV_KEYS[key]} is not a valid number`);
		}
		return num;
	}

	getOptional(key: EnvKey): string | undefined {
		const envKey = ENV_KEYS[key];
		return this.configService.get<string>(envKey);
	}
}
