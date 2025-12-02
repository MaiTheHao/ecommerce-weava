import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * Decorator to validate that a field matches another field
 * Useful for confirming passwords, emails, etc.
 *
 * @param property The property name to match against
 * @param validationOptions Optional validation options
 *
 * @example
 * class UserDto {
 *   @IsString()
 *   password: string;
 *
 *   @Match('password')
 *   confirmedPassword: string;
 * }
 */
export function Match(property: string, validationOptions?: ValidationOptions) {
	return function (target: any, propertyName: string) {
		registerDecorator({
			name: 'match',
			target: target.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];
					return value === relatedValue;
				},
				defaultMessage(args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					return `${args.property} must match ${relatedPropertyName}`;
				},
			},
		});
	};
}
