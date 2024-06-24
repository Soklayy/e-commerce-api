import { IsNotEmpty } from "class-validator";

export class VerificationDto {
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    verificationCode: string;
}