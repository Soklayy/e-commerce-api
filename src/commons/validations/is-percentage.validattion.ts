import { ValidationOptions, registerDecorator, ValidationArguments } from "class-validator";

export function isPercentage(
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsPercentage',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return value >= 0 && value <= 1;
                },
                defaultMessage: () => {
                    return '$property should be a interger from 0 to 1';
                },
            },
        });
    };
}