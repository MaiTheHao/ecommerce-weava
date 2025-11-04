import { IsEmail, IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class RegisterDto {
	@IsEmail({}, { message: 'Email không hợp lệ' })
	email: string;

	@IsNotEmpty({ message: 'Mật khẩu không được để trống' })
	@Length(6, 100, { message: 'Mật khẩu phải có từ 6-100 ký tự' })
	password: string;

	@IsNotEmpty({ message: 'Tên không được để trống' })
	@IsString()
	name: string;

	@IsOptional()
	@IsString()
	phone?: string;
}
