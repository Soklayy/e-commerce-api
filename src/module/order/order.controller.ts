import { Controller, Post, Body, Req, Res, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/commons/decorators/public.decorator';
import { Request } from 'express';
import { CheckTransaction, HookDto } from './dto/check-transaction.dto';

@ApiTags('Orders')
@Controller('check-out')
@ApiBearerAuth()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) { }

  @Post()
  async create(@Req() req: Request, @Body() paymentMethod: CreateOrderDto) {
    const url = await this.orderService.create(req.user?.id, paymentMethod.paymentMethod);
    return url
  }

  @Public()
  @Get()
  allOrder() {
    return this.orderService.findAll()
  }

  @Public()
  @Get('/check')
  order(@Req() req: Request) {
    return this.orderService.findOne(req.user?.id)
  }

  @Public()
  @Post('/hook')
  hook(@Body() dto: HookDto) {
    return this.orderService.hook(dto)
  }
}
