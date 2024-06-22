import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsInt, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import {IsNotZero } from "src/commons/validations";

export class CreateCartDto {
    @ApiProperty({
        type: String,
        example: 'beed0391-677b-454f-94ae-edc651097548',
    })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @IsUUID()
    @IsOptional()
    optionId: string;

    @Transform(({ value }) => (value < 0 ? value * -1 : value))
    @IsInt()
    @IsNotZero()
    quantity: number;
}
