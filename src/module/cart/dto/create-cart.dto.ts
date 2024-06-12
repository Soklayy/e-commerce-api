import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { IsNotZero } from 'src/commons/validations/is-not-zero.valdation';
export class CreateCartDto {
  @ApiProperty({
    type: String,
    example: 'beed0391-677b-454f-94ae-edc651097548',
  })
  @IsUUID()
  @IsNotEmpty()
  productSku: string;

  @IsInt()
  @Transform(({ value }) => value < 0 ? value * (-1) : value)
  @IsNotEmpty()
  @IsNotZero()
  quantity: number;
}
