import { Module } from "@nestjs/common";
import { AppUpdate } from "./bot";

@Module({
    providers: [AppUpdate],
})
export class BotModule { }
