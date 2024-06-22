import { IsEnum } from "class-validator";
import { PaymentMethods } from "src/commons/enums";
import { PaymentOption } from "src/module/aba-payway/aba-payway.interface";

export class CreateOrderDto {
    @IsEnum(PaymentMethods)
    paymentMethod: PaymentMethods
}
