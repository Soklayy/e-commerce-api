import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { BotModuleOption, MODULE_OPTIONS_TOKEN } from './bot.interface';
@Injectable()
export class TelegramBotService extends Telegraf {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private botOptions: BotModuleOption) {
    super(botOptions.token, botOptions.options);
    super.launch();
  }

  /**
   * @deprecated
   * */
  override launch(...args: [onLaunch?: () => void] | [config: Telegraf.LaunchOptions, onLaunch?: () => void]): Promise<void> {
    return;
  }
}
