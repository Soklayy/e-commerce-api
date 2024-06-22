import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { createHmac } from 'crypto';
import { format } from 'date-fns';
import {
  trim,
  TransactionListPayload,
  TransactionPayload,
} from './aba-payway.interface';
import {
  AbaPaywayModuleOption,
  MODULE_OPTIONS_TOKEN,
} from './aba-payway.interface';

@Injectable()
export class AbaPaywayService {
  private readonly client: AxiosInstance;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: AbaPaywayModuleOption,
  ) {
    this.client = axios.create({
      baseURL: options.baseUrl,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async checkTransaction(tran_id: string): Promise<any> {
    const response = await this.client.post(
      '/api/payment-gateway/v1/payments/check-transaction',
      this.createPayload({ tran_id }),
    );
    return response.data;
  }

  async transaction_list({
    from_date,
    to_date,
    from_amount,
    to_amount,
    status,
  }: TransactionListPayload): Promise<any> {
    const response = await this.client.post(
      '/api/payment-gateway/v1/payments/transaction-list',
      this.createPayload({
        from_date,
        to_date,
        from_amount,
        to_amount,
        status,
      }),
      {},
    );

    return response.data;
  }

  async createTransaction({
    tran_id,
    payment_option,
    amount,
    items,
    currency,
    return_url = this.options.returnLink,
    return_deeplink,
    continue_success_url,
    pwt,
    firstname,
    lastname,
    email,
    phone,
  }: TransactionPayload): Promise<AxiosResponse> {
    const base64 = (d: string) => Buffer.from(d).toString('base64');

    if (typeof return_url === 'string') return_url = base64(return_url);
    if (typeof return_deeplink === 'string')
      return_deeplink = base64(return_deeplink);
    if (typeof return_deeplink === 'object' && return_deeplink != null)
      return_deeplink = base64(JSON.stringify(return_deeplink));
    if (typeof items === 'object')
      items = base64(JSON.stringify(items));
    else JSON.stringify('{}')

    const response = await this.client.post(
      '/api/payment-gateway/v1/payments/purchase',
      // order matters here
      this.createPayload({
        tran_id,
        amount,
        items,
        pwt,
        firstname: trim(firstname),
        lastname: trim(lastname),
        email: trim(email),
        phone: trim(phone),
        payment_option,
        return_url,
        continue_success_url,
        return_deeplink,
        currency,
      }),
    );
    return response;
  }

  /**
   * @param {string[]} values
   * @returns {string}
   *
   * @Order-by String = req_time + merchant_id + tran_id + amount + items + shipping + ctid + pwt + firstname + lastname + email + phone + type + payment_option + return_url + cancel_url + continue_success_url + return_deeplink + currency + custom_fields + return_params + public_key.
   * @Note Please note to maintain the sequence of parameters as listed above.
   */
  createHash(...values: string[]): string {
    const data = values.join('');
    return createHmac('sha512', this.options.apiKey)
      .update(data)
      .digest('base64');
  }

  createPayload(
    body: Record<string, any> = {},
    date: Date = new Date(),
  ): FormData {
    body = Object.fromEntries(
      Object.entries(body).filter(([k, v]) => v != null),
    );

    const req_time = format(date, 'yyyyMMddHHmmss');
    const merchant_id = this.options.merchantId;
    const formData = new FormData();
    const entries = Object.entries(body);

    const hash = this.createHash(req_time, merchant_id, ...Object.values(body));

    formData.append('req_time', req_time);
    formData.append('merchant_id', merchant_id);

    for (const [key, value] of entries) {
      formData.append(key, value);
    }

    formData.append('hash', hash);
    return formData;
  }
}
