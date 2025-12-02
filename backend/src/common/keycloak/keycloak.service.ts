import { Injectable } from '@nestjs/common';
import { EnvService } from '@/shared/env/env.service';
import { ENV_KEYS } from '@shared/const/env.const';

@Injectable()
export class keycloakService {
	constructor(private readonly envService: EnvService) {}

	getConfig() {
		return {
			authServerUrl: this.envService.getOptional(ENV_KEYS.KEYCLOAK_AUTH_SERVER_URL) || `http://localhost:${this.envService.getOptional(ENV_KEYS.KEYCLOAK_PORT) || '8081'}`,
			realm: this.envService.getOptional(ENV_KEYS.KEYCLOAK_REALM) || 'weava',
			clientId: this.envService.getOptional(ENV_KEYS.KEYCLOAK_CLIENT_ID) || 'nest-api',
			secret: this.envService.getOptional(ENV_KEYS.KEYCLOAK_CLIENT_SECRET) || 'secret',
		};
	}
}
