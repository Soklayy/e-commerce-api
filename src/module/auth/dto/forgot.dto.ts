import { IsEmail } from 'class-validator';
import { IsExists } from 'src/commons/validations';
import { User } from 'src/module/user/entities/user.entity';

export class ForgotDto {
  @IsEmail()
  @IsExists([User], { message: `User with this email doesn't exist!` })
  email: string;
}
