import { Module } from '@nestjs/common';
import { keycloakService } from './keycloak.service';

@Module({
	providers: [keycloakService],
	exports: [keycloakService],
})
export class KeycloakModule {}
