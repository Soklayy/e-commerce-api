import { ConfigurableModuleBuilder } from '@nestjs/common';
import { FirebaseOptions } from 'firebase/app';

export interface FirebaseModuleOption extends FirebaseOptions {}
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<FirebaseModuleOption>()
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
