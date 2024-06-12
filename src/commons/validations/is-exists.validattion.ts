import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntitySchema, FindOptions, ObjectType } from 'typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'exist', async: true })
export class ExistValidator implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  public async validate<E>(value: string, args: ExistsValidationArguments<E>) {
    const [EntityClass, findCondition = args.property] = args.constraints;

    let whereCondition: Record<string, any>;

    if (typeof findCondition === 'function') {
      whereCondition = findCondition(args);
    } else {
      whereCondition = {
        [findCondition || args.property]: value,
      };
    }

    return (
      (await this.dataSource?.getRepository(EntityClass).count({
        where: whereCondition,
      })) > 0
    );
  }

  defaultMessage(args: ValidationArguments) {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `The selected ${args.property}  does not exist in ${entity} entity`;
  }
}

type ExistsValidationConstraints<E> = [
  ObjectType<E> | EntitySchema<E> | string,
  ((validationArguments: ValidationArguments) => FindOptions<E>) | keyof E,
];
interface ExistsValidationArguments<E> extends ValidationArguments {
  constraints: ExistsValidationConstraints<E>;
}

export function IsExists<E>(
  constraints: Partial<ExistsValidationConstraints<E>>,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints,
      validator: ExistValidator,
    });
  };
}
