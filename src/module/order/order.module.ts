import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Carts } from '../cart/entities/carts.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Order, Carts])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
