import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbaPaywayService } from '../aba-payway';
import { PaymentMethods, PaymentStatus } from 'src/commons/enums';
import { Carts } from '../cart/entities/carts.entity';
import { Order } from './entities/order.entity';
import { HookDto } from './dto/check-transaction.dto';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { generateMarkdownInvoice } from 'src/template/invoice';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Carts)
    private readonly cartRepo: Repository<Carts>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly payway: AbaPaywayService,
    @InjectBot()
    private readonly bot: Telegraf<Context>,
    private readonly configService: ConfigService
  ) { }

  async create(userId: string, paymentMethod: PaymentMethods) {
    try {

      // const cart = await this.cartRepo.findOne({
      //   where: { user: { id: userId } },
      //   select: {
      //     cartItem: {
      //       id: true,
      //       quantity: true,
      //       productSku: {
      //         sku: true,
      //         price: true,
      //         discount: true,
      //         images: true
      //       },
      //       productOption: {
      //         id: true,
      //         priceIncrement: true,
      //         available: true
      //       }
      //     },
      //   },
      //   relations: {
      //     cartItem: {
      //       productSku: true,
      //       productOption: true
      //     },
      //   },
      // });

      const cart = await this.cartRepo.findOne({
        where: { user: { id: userId } },
        select: {
          cartItem: {
            id: true,
            quantity: true,
            product: {
              price: true,
              discount: true,
            },
            productOption: {
              priceIncrement: true,
              id: true,
              name: true
            }
          }
        },
        relations: {
          cartItem: {
            product: true,
            productOption: true
          }
        }
      })

      let total = 0;
      cart.cartItem?.map((item) => {
        total += item.amount
      });
      cart.total = Number(total.toFixed(2))

      const tranId = new Date().getTime().toString(36);
      const response = await this.payway.createTransaction({
        tran_id: tranId,
        payment_option: paymentMethod,
        amount: cart.total,
        items: cart,
        currency: 'USD',
      })

      let order = await this.orderRepo.findOneBy({ user: { id: userId }, paymentStatus: PaymentStatus.PENDING });

      order
        ? await this.orderRepo.update({
          id: order.id
        }, {
          tranId: tranId,
          item: cart.cartItem,
          total: cart.total
        })
        : await this.orderRepo.save(this.orderRepo.create({
          user: { id: userId },
          tranId: tranId,
          item: cart.cartItem, total: cart.total,
        }));

      if (paymentMethod === PaymentMethods.ABAPAY || paymentMethod === PaymentMethods.CARDS) {
        return {
          payment: `${response.request.protocol}${response.request.host}${response.request.path}`
        }
      }
      return response.data;

    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return await this.payway.transaction_list({});
  }

  async findOne(userId: string) {
    // const data = await this.payway.checkTransaction(tranId)
    // if (data?.status === 11) throw new InternalServerErrorException('Payway server side error.')
    const data = await this.orderRepo.find({
      where: {
        user: { id: userId }
      }
    })
    return data
  }

  async hook(dto: HookDto) {
    try {
      const order = await this.orderRepo.findOne({
        where: {
          tranId: dto.tran_id
        },
        relations: {
          user: true
        }
      })
  
      if (!order) {
        return;
      }
      this.orderRepo.update({ id: order.id }, { paymentStatus: PaymentStatus.PAID })
      
      await this.cartRepo.delete({ user: { id: order.user.id } })
      
      await this.cartRepo.save(this.cartRepo.create({ user: { id: order.user.id } }))
  
      this.bot.telegram.sendMessage(
        this.configService.get<string>('PRIVATE_GROUP'),
        generateMarkdownInvoice(order),
        { parse_mode: 'Markdown' }
      )
    } catch (error) {
      this.logger.error(error);
    }
  }
}
