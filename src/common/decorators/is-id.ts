import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { NumberUtils } from '../../utils/number';

@ValidatorConstraint({ async: false })
export class IsValidIdConstraint implements ValidatorConstraintInterface {
    validate(value: any) {
        if (value === null || value === undefined) return false;
        return NumberUtils.isValidId(value);
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a valid ID`;
    }
}

export function IsId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidIdConstraint,
        });
    };
}
