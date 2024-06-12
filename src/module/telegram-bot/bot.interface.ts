import { ConfigurableModuleBuilder } from "@nestjs/common";
export interface BotModuleOption {
    token: string;
    options?: {}
}
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } = new ConfigurableModuleBuilder<BotModuleOption>()
    .setClassMethodName('forRoot')
    .setExtras(
        {
            isGlobal: true,
        },
        (definition, extras) => ({
            ...definition,
            global: extras.isGlobal,
        }),
    )
    .build();