import { ConfigurableModuleBuilder } from '@nestjs/common';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<AbaPaywayModuleOption>()
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

export interface AbaPaywayModuleOption {
  baseUrl: string;
  merchantId: string;
  apiKey: string;
  returnLink?:string;
}

export function trim(value: any): string {
  if (typeof value === 'string') return value.trim();
  return value;
}

export interface TransactionPayload {
  tran_id: string;
  payment_option: PaymentOption;
  amount: number;
  items?: string | Object;
  currency: 'USD' | 'KHR';
  return_url?: string;
  return_deeplink?: string | { android_scheme: string; ios_scheme: string };
  continue_success_url?: string;
  pwt?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
}

export interface TransactionListPayload {
  from_date?: string;
  to_date?: string;
  from_amount?: string;
  to_amount?: string;
  status?: TransactionStatus;
}

export type TransactionStatus =
  | 'APPROVED'
  | 'DECLINED'
  | 'PENDING'
  | 'PRE-AUTH'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentOption =
  | 'cards'
  | 'abapay'
  | 'abapay_deeplink'
  | 'abapay_khqr_deeplink'
  | 'wechat'
  | 'alipay'
  | 'bakong';
