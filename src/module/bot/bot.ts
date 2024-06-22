import { SkipThrottle } from '@nestjs/throttler';
import {
    Update,
    Ctx,
    Start,
    Help,
    On,
    Hears,
} from 'nestjs-telegraf';
import { Public } from 'src/commons/decorators/public.decorator';
import { Context as TelegrafContext } from "telegraf"

@Public()
@Update()
@SkipThrottle()
export class AppUpdate {

    @Start()
    async start(@Ctx() ctx: TelegrafContext) {
        await ctx.reply('Welcome');
    }

    @Help()
    async help(@Ctx() ctx: TelegrafContext) {
        await ctx.reply('Send me a sticker');
    }

    @On('sticker')
    async on(@Ctx() ctx: TelegrafContext) {
        await ctx.reply('👍');
    }

    @Hears('hi')
    async hears(@Ctx() ctx: TelegrafContext) {
        await ctx.reply('Hey there');
    }
}