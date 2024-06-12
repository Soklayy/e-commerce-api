import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCartDto {
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
