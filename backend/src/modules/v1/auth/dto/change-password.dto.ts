import { IsNotEmpty, Length } from 'class-validator';

export class ChangePasswordDto {
	@IsNotEmpty()
	@Length(6, 100)
	oldPassword: string;

	@IsNotEmpty()
	@Length(6, 100)
	newPassword: string;
}
