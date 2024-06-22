import { IsOptional } from "class-validator";

export class CheckTransaction {
    tran_id: string;
}

export class HookDto {
    @IsOptional()
    tran_id: string;
    @IsOptional()
    apv: string;
    @IsOptional()
    status: number;
}